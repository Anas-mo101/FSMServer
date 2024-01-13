import { 
    GetACT,
    UpdateACTLastNode,
    updateACTisDone,
    NodeFunctionality,
    AutomationConstructor,
    AutomationNode,
    AutomationError,
    AutomationConcernTopic,
    AutomationEdge,
    isAutomationError
} from "./Interfaces";


export class Automation {
    private getACT: GetACT;
    private updateLastNode: UpdateACTLastNode;
    private toggleACTIsDone: updateACTisDone;

    private nodeFunctions: NodeFunctionality[];
    private startingNodeType: string;

    private constructor(props: any) {
        Object.assign(this, props);
    }

    static create(props = {} as AutomationConstructor): Automation {
        return new Automation(props || {}) as Automation
    }

    async trigger(input: string, actId: string, params?: any): Promise<AutomationNode | AutomationError> {
        const act: AutomationConcernTopic = await this.getACT(actId);
        const node: AutomationNode | AutomationError = await this.proccessAutomationFlow(input, act, params);
        return node;
    }

    getNodesSelection() {
        return this.nodeFunctions.map((e) => {
            return {
                type: e.type,
                title: e.title
            }
        });
    }

    private async proccessAutomationFlow(input: string, act: AutomationConcernTopic, params?: any): Promise<AutomationNode | AutomationError> {
        const nodes: AutomationNode[] = act.flow.nodes as Array<AutomationNode>;
        const edges: AutomationEdge[] = act.flow.edges as Array<AutomationEdge>;
        let lastNodeId: string | undefined = act.lastNodeId;

        // STEP 1: GET LAST NODE (OR FIRST IF LAST DOES NOT EXIST)
        if (!lastNodeId) {
            const startNode: AutomationNode | undefined = nodes.find((e) => e.type === this.startingNodeType);
            if (!startNode) {
                // FLOW IS OVER
                this.toggleACTIsDone(act.id, true);

                return {
                    errorCode: 400,
                    errorMessage: "Can Not Find Starting Node"
                };
            }

            lastNodeId = startNode.id;
        }

        // STEP 2: VALIDATE INPUT
        const lastNode = nodes.find((e) => e.id === lastNodeId);

        const isValid = this.validateNode(lastNode!, input, params, );
        if (!isValid) {
            return {
                errorCode: 401,
                errorMessage: "Invalid Input"
            };
        }

        // STEP 3: DECIDE WHICH NEXT NODE
        const nextNode = this.decideNextNode(input, lastNode!, edges, nodes);
        if (!nextNode) {
            // FLOW IS OVER
            this.toggleACTIsDone(act.id, true);

            return {
                errorCode: 403,
                errorMessage: "Can Not Find Next Node"
            }
        }

        /// EXECUTE PRE-SCRIPT
        await this.executePreScripts(input, nextNode!, edges, nodes);

        // STEP 4: EXECUTE NEXT NODE
        const executionData: any = this.executeNode(input, nextNode, act, params);
        nextNode.executionData = executionData

        // STEP 5: SAVE NEXT NODE FOR COMING ITERATION
        this.updateLastNode(act.id, nextNode.id);

        return nextNode;
    }

    private executeNode(input: string, node: AutomationNode, act: AutomationConcernTopic, params?: any): any {
        const nodeFunction = this.nodeFunctions.find((e) => e.type === node.type);
        if (nodeFunction) {
            return nodeFunction.process(input, node, act, params);
        }
    }

    private decideNextNode(input: string, lastNode: AutomationNode, edges: AutomationEdge[], nodes: AutomationNode[]): AutomationNode | undefined {
        const nodeFunction = this.nodeFunctions.find((e) => e.type === lastNode.type);
        if (nodeFunction) {
            /// CUSTOM NEXT NODE LOGIC
            if (nodeFunction.decideNextNode != null) {
                const nextNode = nodeFunction.decideNextNode(input, lastNode, edges, nodes);
                return nextNode;
            }
        }

        /// DEFAULT NEXT NODE LOGIC

        const connectingEdge = edges.find((e) => e.source === lastNode?.id);
        if (!connectingEdge) {
            return;
        }

        const nextNode = nodes.find((e) => e.id === connectingEdge.target);
        if (!nextNode) {
            return;
        }

        return nextNode;
    }

    private async executePreScripts(input: string, node: AutomationNode, edges: AutomationEdge[], nodes: AutomationNode[]): Promise<AutomationError | undefined> {
        const nodeFunction = this.nodeFunctions.find((e) => e.type === node.type);
        if (nodeFunction) {
            const length = nodeFunction.preScripts?.length ?? 0;
            for (let index = 0; index < length; index++) {
                const execute = nodeFunction.preScripts![index];
                const response = await execute(input, node!, edges, nodes);

                if(isAutomationError(response)){
                    return response
                }
            }
        }

        return;
    }

    private validateNode(node: AutomationNode, input: string, act: AutomationConcernTopic, params?: any): boolean {
        const nodeFunction = this.nodeFunctions.find((e) => e.type === node.type);
        if (nodeFunction) {
            if (nodeFunction.validateInput == null) {
                return true;
            }

            if (nodeFunction.validateInput(input, params)) {
                return true;
            }

            if(nodeFunction.repeatOnInvalidity){
                this.executeNode(input, node, act, params);
            }

            return false;
        }

        // smth very wrong
        return true;
    }
}
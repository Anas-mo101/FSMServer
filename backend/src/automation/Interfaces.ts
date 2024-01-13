export interface AutomationNode {
    id: string;
    type: string;
    data: any;
    executionData?: any;
}

export interface AutomationEdge {
    id: string;
    source?: string;
    sourceHandle?: string
    target?: string
    targetHandle?: string
}

export interface AutomationFlow {
    nodes: Array<AutomationNode>;
    edges: Array<AutomationEdge>;
}

export interface AutomationConcernTopic {
    id: string,
    flow: AutomationFlow,
    isDone: boolean,
    lastNodeId?: string
}

export type GetACT = (id: string) => Promise<AutomationConcernTopic>;
export type UpdateACTLastNode = (id: string, nodeId: string) => void;
export type updateACTisDone = (id: string, isDone: boolean) => void;
export type ValidateInput = (input: string, params?: any) => boolean;
export type DecideNextNode = (input: string, lastNode: AutomationNode, edges: AutomationEdge[], nodes: AutomationNode[]) => AutomationNode | undefined;
export type PreScript = (input: string, node: AutomationNode, edges: AutomationEdge[], nodes: AutomationNode[]) => Promise<AutomationError | undefined>;
export type NodeFunction = (input: string, node: AutomationNode, act: AutomationConcernTopic, params?: any) => any;

export interface NodeFunctionality {
    title: string;
    type: string;
    process: NodeFunction;
    validateInput?: ValidateInput;
    decideNextNode?: DecideNextNode;
    repeatOnInvalidity: boolean;
    preScripts?: PreScript[]
}

export interface AutomationConstructor {
    getACT: GetACT;
    updateLastNode: UpdateACTLastNode;
    toggleACTIsDone: updateACTisDone;
    nodeFunctions: NodeFunctionality[];
    startingNodeType: string;
}

export interface AutomationError {
    errorCode: number;
    errorMessage: string;
}

export function isAutomationError(object: any): object is AutomationError {
    return 'errorMessage' in object && 'errorCode' in object;
}
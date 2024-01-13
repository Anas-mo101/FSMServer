import { getIO } from "../../services/WSServices/socket";
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
    ValidateInput
} from "../Interfaces";


const valiateInput = (value: string, params?: any): boolean => {
    return true;
}


const decideNextNode = (input: string, lastNode: AutomationNode, edges: AutomationEdge[], nodes: AutomationNode[]): AutomationNode | undefined => {
    const connectingEdges = edges.filter((e) => e.source === lastNode.id);
    const choices: string[] = lastNode?.data?.handleValues ?? [];

    if (!choices.includes(input)) {
        return;
    }

    const index = choices.indexOf(input);

    const connectingEdge = connectingEdges.find((e) => e.sourceHandle === `handle-${index}`);

    if (!connectingEdge) {
        return;
    }

    const nextNode = nodes.find((e) => e.id === connectingEdge.target);

    return nextNode;
}


const process = (input: string, node: AutomationNode, act: AutomationConcernTopic, params: any): any => {
    const io = getIO();
    io.emit("currentNode", {
        action: "update",
        currentNodeId: node.id,
        userId: act.id
    });
    
    return {
        title: "Profile"
    }
}

export const profile: NodeFunctionality = {
    title: "Profile",
    type: "profile",
    repeatOnInvalidity: false,
    // validateInput: valiateInput,
    decideNextNode: decideNextNode,
    process: process,
}

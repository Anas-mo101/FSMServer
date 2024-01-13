import ShowUserService from "../services/UserServices/ShowUserService";
import { Automation } from "./AutomationController";
import UpdateUserService from "../services/UserServices/UpdateUserService";

import { AutomationFlow } from "./Interfaces";
import { home } from "./Nodes/Home";
import { profile } from "./Nodes/Profile";
import { news } from "./Nodes/News";
import { singleNews } from "./Nodes/SingleNews";

const automation = Automation.create({
    getACT: async (id: string) => {
        const user = await ShowUserService(id);
        if (user?.userflow?.flow?.flow === undefined) {
            return {
                id: id,
                isDone: false,
                lastNodeId: undefined,
                flow: {
                    nodes: [],
                    edges: []
                }
            }
        }

        const automationFlow = JSON.parse(user!.userflow!.flow!.flow) as AutomationFlow;

        return {
            id: id,
            isDone: user.userflow.isDone ?? false,
            lastNodeId: user.userflow.lastNode,
            flow: automationFlow
        };
    },
    updateLastNode: (id: string, nodeId: string) => {
        UpdateUserService({
            userData: { lastNode: nodeId },
            userId: id
        });
    },
    toggleACTIsDone: (id: string, isDone: boolean) => {
        UpdateUserService({
            userData: { isDone: isDone },
            userId: id
        });
    },
    nodeFunctions: [ home, profile, news, singleNews ],
    startingNodeType: "input"
});

export {
    automation,
};
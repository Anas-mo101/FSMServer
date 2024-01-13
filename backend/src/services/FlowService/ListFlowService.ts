import { Sequelize } from "sequelize";
import Flow from "../../models/Flow";
import { AutomationFlow } from "../../automation/Interfaces";

interface Request {
  searchParam?: string;
  pageNumber?: string;
}

interface Response {
  flows: Flow[];
  count: number;
  hasMore: boolean;
}

const ListFlowService = async ({
  searchParam = "",
  pageNumber = "1"
}: Request): Promise<Response> => {
  const whereCondition: any = {
    title: Sequelize.where(
      Sequelize.fn("LOWER", Sequelize.col("title")),
      "LIKE",
      `%${searchParam.toLowerCase().trim()}%`
    )
  };

  const allFlag = parseInt(pageNumber) >= 0 ? false : true;

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: flows } = allFlag ? await Flow.findAndCountAll({ where: whereCondition }) : await Flow.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "ASC"]]
  });

  const hasMore = count > offset + flows.length;

  return {
    flows,
    count,
    hasMore
  };
};

export default ListFlowService;

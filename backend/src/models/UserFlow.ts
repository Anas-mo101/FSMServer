import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    Default,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import AutomationFlow from "./Flow";
import User from "./User";

@Table
class UserFlow extends Model<UserFlow> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @Default(false)
    @Column
    isDone: boolean;

    @Column
    lastNode?: string;

    @ForeignKey(() => AutomationFlow)
    @Column
    flowId?: number;

    @BelongsTo(() => AutomationFlow)
    flow?: AutomationFlow;
}

export default UserFlow;

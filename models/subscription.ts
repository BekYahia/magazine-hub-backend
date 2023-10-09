import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize }  from '.'

import User from './user'
import Magazine from './magazine'

// We recommend you declare an interface for the attributes, for stricter typechecking
interface SubscriptionAttributes {
  id?: number
  UserId?: number
  MagazineId?: number
  start_date: Date
  end_date: Date
  is_active: boolean
  payment_status?: string
}

// Some fields are optional when calling SubscriptionModel.create() or SubscriptionModel.build()
interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id'> {}

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
	public id!: number	//Note that the `null assertion` `!` is required in strict mode.
	public UserId!: number
	public MagazineId!: number
	public start_date!: Date
	public end_date!: Date
	public is_active!: boolean
    public payment_status!: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	dataValues!: SubscriptionAttributes
}

Subscription.init (
    {
        UserId: DataTypes.NUMBER,
        MagazineId: DataTypes.NUMBER,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
		is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        payment_status: {
            type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
            defaultValue: 'pending',
        },
	},
	{
		tableName: 'Subscriptions',
		sequelize
	}
)

//associations
Subscription.belongsTo(User, { foreignKey: 'UserId', targetKey: 'id' })
Subscription.belongsTo(Magazine, { foreignKey: 'MagazineId', targetKey: 'id' })

export default Subscription
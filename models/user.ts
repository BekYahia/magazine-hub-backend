import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize }  from '.'

// We recommend you declare an interface for the attributes, for stricter typechecking
type roleType = 'user' | 'admin'
interface UserAttributes {
  id?: number
  name: string
  email: string
  password: string
  role?: roleType
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number	//Note that the `null assertion` `!` is required in strict mode.
	public name!: string
	public email!: string
	public password!: string
	public role!: roleType

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	static hashPwd: (password: string) => Promise<string>

	verifyPass!: (password: string) => Promise<boolean>
	getJwt!: () => string
	// dataValues!: () => User
	dropPwd!: () => Partial<User>
}

User.init (
	{
		name: DataTypes.STRING,
		password: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			}
		},
		role: {
			type: DataTypes.TEXT,
			defaultValue: 'user',
		}
	},
	{
		tableName: 'Users',
		sequelize
	}
)

export default User
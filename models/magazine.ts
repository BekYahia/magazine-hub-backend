import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize }  from '.'

// We recommend you declare an interface for the attributes, for stricter typechecking
interface MagazineAttributes {
  id?: number
  title: string
  description: string
  price: number
  publication_date?: Date //for the monthly content distribution
  is_active: boolean
}

// Some fields are optional when calling MagazineModel.create() or MagazineModel.build()
interface MagazineCreationAttributes extends Optional<MagazineAttributes, 'id' | 'publication_date'> {}

class Magazine extends Model<MagazineAttributes, MagazineCreationAttributes> implements MagazineAttributes {
	public id!: number	//Note that the `null assertion` `!` is required in strict mode.
	public title!: string
	public description!: string
	public price!: number
	public publication_date!: Date
	public is_active!: boolean

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	dataValues!: MagazineAttributes
}

Magazine.init (
	{
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		price: DataTypes.NUMBER,
        publication_date: DataTypes.DATE,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		tableName: 'Magazines',
		sequelize
	}
)

export default Magazine
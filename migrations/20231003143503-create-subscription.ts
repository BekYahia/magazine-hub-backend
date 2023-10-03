'use strict'
module.exports = {
	//@ts-ignore
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Subscriptions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			UserId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			MagazineId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Magazines',
					key: 'id'
				}
			},
			payment_status:  {
				type: Sequelize.STRING(15)
			},
			start_date: {
				type: Sequelize.DATE
			},

			end_date: {
				type: Sequelize.DATE
			},
			is_active: {
				type: Sequelize.BOOLEAN
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP")
			}
		})
	},
	//@ts-ignore
	down: async (queryInterface, _Sequelize) => {
		await queryInterface.dropTable('Subscriptions');
	}
}
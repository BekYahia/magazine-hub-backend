'use strict'
module.exports = {
	//@ts-ignore
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Magazines', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				type: Sequelize.STRING(150)
			},
			description: {
				type: Sequelize.STRING
			},
			price: {
				type: Sequelize.DECIMAL(10, 2) //max: 99,999,999.99
			},
			publication_date: {
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
		await queryInterface.dropTable('Magazines');
	}
}
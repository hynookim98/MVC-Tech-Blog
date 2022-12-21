const { Model, DataTypes } = require('sequelize');
// using bcrypt to hash user passwords
const bcrypt = require('bcrypt');
const sequelize = require('../config');

class User extends Model {
    // custom method to check to see if password user enters is same as password stored with bcrypt
    passwordAuthorization(userPass) {
        return bcrypt.compareSync(userPass, this.password)
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // give each user a primary key so we can identify them w/out username
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // makes sure password length is at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // function hooks onto data before create and before update
            beforeCreate: async(newUser) => {
                // hashes user password before creating user
                newUser.password = await bcrypt.hash(newUser.password, 10);
                return newUser;
            },
            // hashes user password when updated
            beforeUpdate: async(newPass) => {
                newPass.password = await bcrypt.hash(newPass.password, 10);
                return newPass;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'User'
    }
);

module.exports = User;
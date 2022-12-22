import { DataTypes, Model, Optional, CreationOptional } from 'sequelize'
import { sequelizeDb as sequelize } from '../db';

interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    token: string;
    active: boolean;
    role_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export type UserCreationAttributes = Optional<IUser, 'id'>

export class User extends Model<IUser, UserCreationAttributes> {
    declare id: CreationOptional<number>;
    declare name: string | null;
    declare username: string | null;
    declare email: string | null;
    declare password: string | null;
    declare token: string | null;
    declare active: boolean | null;
    declare role_id: number | null;
    declare createdAt: Date | null;
    declare updatedAt: Date | null;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(40),
            allowNull: false,
        },
        username: {
            type: new DataTypes.STRING(60),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false,
        },
        token: {
            type: new DataTypes.STRING(255),
            allowNull: true,
        },
        active: {
            type: new DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        role_id: {
            type: new DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'user',
    }
)
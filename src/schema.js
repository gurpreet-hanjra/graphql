// import * as _ from 'underscore';

// This is the Dataset in our Blog
import EmployeeList from './data/employees';
import ProjectList from './data/projects';
import BudgetList from './data/budget';

import {
    // These are the basic GraphQL types
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    // GraphQLEnumType,

    // This is used to create required fields and arguments
    GraphQLNonNull,

    // This is the class we need to create the schema
    GraphQLSchema
} from 'graphql';

/**
 DEFINE YOUR TYPES BELOW
 **/

const Employee = new GraphQLObjectType({
    name       : 'Employee',
    description: 'This represents an Employee',
    fields     : () => ({
        empID  : {type: new GraphQLNonNull(GraphQLInt)},
        empName: {type: new GraphQLNonNull(GraphQLString)},
        skills : {type: GraphQLString},
        project: {type: GraphQLString},
        role   : {type: GraphQLString}
    })
});

const Project = new GraphQLObjectType({
    name       : 'Project',
    description: 'This represents a project',
    fields     : () => ({
        projectID  : {type: new GraphQLNonNull(GraphQLString)},
        projectName: {type: GraphQLString},
        budget     : {type: GraphQLString},
        startDate  : {type: GraphQLString},
        endDate    : {type: GraphQLString},
        manager    : {type: GraphQLInt}
    })
});

const Budget = new GraphQLObjectType({
    name       : 'Budget',
    description: 'This represents budget of project',
    fields     : () => ({
        code     : {type: new GraphQLNonNull(GraphQLString)},
        maxBudget: {type: GraphQLInt},
        minBudget: {type: GraphQLInt}
    })
});


const ProjectDetails = new GraphQLObjectType({
    name       : 'ProjectDetails',
    description: 'Details of the project',
    fields     : () => ({
        projectID  : {type: new GraphQLNonNull(GraphQLString)},
        projectName: {type: GraphQLString},
        startDate  : {type: GraphQLString},
        endDate    : {type: GraphQLString},
        manager    : {type: GraphQLInt},
        budget     : {
            type   : Budget,
            resolve: function (proj) {
                return BudgetList.find(a => a.code === proj.budget);
            }
        }
    })
});

const EmployeeDetails = new GraphQLObjectType({
    name       : 'EmployeeDetails',
    description: 'All details of an Employee',
    fields     : () => ({
        empID  : {type: new GraphQLNonNull(GraphQLInt)},
        empName: {type: new GraphQLNonNull(GraphQLString)},
        skills : {type: GraphQLString},
        project: {
            type   : ProjectDetails,
            resolve: function (emp) {
                return ProjectList.find(a => a.projectID === emp.project);
            }
        }
    })
});

const Query = new GraphQLObjectType({
    name       : 'StaffingSchema',
    description: 'Root of the Staffing Schema',
    fields     : () => ({
        employee       : {
            type   : new GraphQLList(Employee),
            resolve: function () {
                return EmployeeList;
            }
        },
        project        : {
            type   : new GraphQLList(Project),
            resolve: function () {
                return ProjectList;
            }
        },
        budget         : {
            type   : new GraphQLList(Budget),
            resolve: function () {
                return BudgetList;
            }
        },
        employeeDetails: {
            type       : EmployeeDetails,
            description: 'Provides complete details of an employee',
            args       : {
                id: {type: GraphQLInt, description: 'Pass employee id here'}
            },
            resolve    : function (root, {id}) {
                return EmployeeList.find(e => e.empID == `${id}`);
            }
        }
    })
});


// const Mutation = new GraphQLObjectType({
//   name: 'StaffingMutations',
//   description: 'Mutations of Staffing',
//   fields: () => ({
//     createEmployee: {
//       type: Employee,
//       args: {
//         empName: {type: new GraphQLNonNull(GraphQLString)},
//         skills: {type: GraphQLString}
//       },
//       resolve: (source, args) => {
//         let employee = Object.assign({},args);
//         employee.empID = `${Math.ceil(Math.random() * 100000)}`;
//
//         //Add the employee
//         EmployeeList.push(employee);
//
//         return employee;
//       }
//     }
//   })
// });

// This is the Root Query
// const Query = new GraphQLObjectType({
//   name: 'BlogSchema',
//   description: 'Root of the Blog Schema',
//   fields: () => ({
//     echo: {
//       type: GraphQLString,
//       description: 'Echo what you enter',
//       args: {
//         message: {type: GraphQLString, description:"give me a message"}
//       },
//       resolve: function(source, {message}) {
//         //return `received ${message}`;
//         return JSON.stringify({aa:10});
//       }
//     }
//   })
// });

// The Schema
const Schema = new GraphQLSchema({
    query: Query
    // mutation: Mutation
});

export default Schema;

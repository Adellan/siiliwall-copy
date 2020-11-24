import { gql } from '@apollo/client'

export const PROJECT_BY_ID = gql`
    query projectById($projectId: ID!) {
        projectById(id: $projectId) {
            id
            name
            boards {
                id
                name
                orderNumber
                ticketCount
                color
            }
        }
    }
`
export const BOARDS_BY_PROJECT_ID = gql`
    query boardsByProjectId($projectId: ID!) {
        boardsByProjectId(id: $projectId) {
            id
            name
            orderNumber
        }   
    }
`
export const ALL_PROJECTS = gql`
    query {
        allProjects {
            id
            name
            orderNumber
        }
    }
`
export const ADD_PROJECT = gql`
    mutation addProject($name: String!) {
        addProject(name: $name) {
            id
            name
        }
    }
`

// dummy data
const projects = [{
    id: '9da1b35f-181a-4397-a5a5-47abced10a66', name: 'SiiliWall', orderNumber: 1,
}]
const boards = [{
    id: '83fa4f89-8ea1-4d1c-9fee-321daa941485', prettyId: 'PO', name: 'PO:n taulu', creatorId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576', orderNumber: 2, ticketCount: 2, projectId: '9da1b35f-181a-4397-a5a5-47abced10a66', color: 0
},
{
    id: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e', prettyId: 'DEV', name: 'Devaajan taulu', creatorId: '654df13f-51be-4b25-8f0e-7c2f40a3a81e', orderNumber: 3, ticketCount: 2, projectId: '9da1b35f-181a-4397-a5a5-47abced10a66', color: 1
},
{
    id: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83', prettyId: 'KNBN', name: 'Kanban', creatorId: '8b251e01-0bec-41bf-b756-ba53c76d04e6', orderNumber: 1, ticketCount: 10, projectId: '9da1b35f-181a-4397-a5a5-47abced10a66', color: 0
},
{
    id: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83', prettyId: 'STR', name: 'StoryBoard', creatorId: '8b251e01-0bec-41bf-b756-ba53c76d04e6', orderNumber: 4, ticketCount: 0, projectId: '9da1b35f-181a-4397-a5a5-47abced10a66', color: 0
}]

const users = [
    {
        id: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        userName: 'Paavo',
        passwordHash: 'pVfUtAA3',
        email: 'dmonteith0@mysql.com',
    },
    {
        id: '654df13f-51be-4b25-8f0e-7c2f40a3a81e',
        userName: 'Ilpo',
        passwordHash: 'JaAcfq',
        email: 'dcutchey1@over-blog.com',
    },
    {
        id: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        userName: 'Katja',
        passwordHash: '71gDVE6meHB',
        email: 'ggwyther2@harvard.edu',
    },
    {
        id: 'db295a15-0b1d-4e6d-a2bb-da25fe1ecf98',
        userName: 'Pauliina',
        passwordHash: '7PwsnfIiyJNt',
        email: 'loxnam3@quantcast.com',
    },
    {
        id: '1fd5abe7-159e-4224-8a44-7ae3ee902a54',
        userName: 'Heini',
        passwordHash: '3KWad8H',
        email: 'eholtom4@hatena.ne.jp',
    },
    {
        id: 'e8a3f9a4-e9ac-47ec-9eb6-f7f87975382a',
        userName: 'Erika',
        passwordHash: '6xswZfRQe9X',
        email: 'spankettman5@latimes.com',
    },
    {
        id: '6285867e-7db8-4769-8730-26d18ef9aba9',
        userName: 'scovil6',
        passwordHash: 'O2dyiBYteo',
        email: 'gwoollends6@163.com',
    },
]

const columns = [
    {
        name: 'Todo',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
        orderNumber: 1,
        id: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0527',
    },
    {
        name: 'In Progress',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
        orderNumber: 2,
        id: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0528',
    },
    {
        name: 'Test',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
        orderNumber: 3,
        id: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0529',
    },
    {
        name: 'Done',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
        orderNumber: 4,
        id: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0530',
    },
    {
        name: 'Todo',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
        orderNumber: 1,
        id: 'b23f9b7f-ab9f-4219-9604-2178751ce948',
    },
    {
        name: 'In Progress',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
        orderNumber: 2,
        id: '0880a57b-372f-4fe7-8923-e90a92331ab6',
    },
    {
        name: 'Test',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
        orderNumber: 3,
        id: '7bce34e5-385b-41e6-acd3-ceb4bd57b4f6',
    },
    {
        name: 'Done',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
        orderNumber: 4,
        id: '7bce34e5-385b-41e6-acd3-ceb4bd57b4r4',
    },
    {
        name: 'Todo',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        orderNumber: 1,
        id: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
    },
    {
        name: 'In progress',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        orderNumber: 2,
        id: 'f6209adb-91ca-476b-8269-328a82d05d4a',
    },
    {
        name: 'Test',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        orderNumber: 3,
        id: 'f6209adb-91ca-476b-8269-328a82d05d41',
    },
    {
        name: 'Done',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        orderNumber: 4,
        id: 'f6209adb-91ca-476b-8269-328a82d05drt',
    },
    {
        name: 'Todo',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
        orderNumber: 1,
        id: 'asd75646-4035-41f5-99d7-7d742f0e8ac5',
    },
    {
        name: 'In progress',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
        orderNumber: 2,
        id: 'f6209adb-asda-476b-8269-328a82d05d4a',
    },
    {
        name: 'In Review',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
        orderNumber: 3,
        id: 'f6209adb-91ca-476b-866a-328a82d05d41',
    },
    {
        name: 'Done',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
        orderNumber: 4,
        id: 'f6209adb-91ca-476b-8269-asda82d05drt',
    },
]

const stories = [
    {
        title: 'First story',
        description: 'this is the content',
        size: 4,
        columnId: 'asd75646-4035-41f5-99d7-7d742f0e8ac5',
        id: 'asd75646-6666-41f5-99d7-7d742f0e8ac5',
        ownerId: '1fd5abe7-159e-4224-8a44-7ae3ee902a54',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
    },
    {
        title: 'Second story',
        description: 'this is the content',
        size: 2,
        columnId: 'asd75646-4035-41f5-99d7-7d742f0e8ac5',
        id: 'asd75646-6666-41f5-99d7-7d742f0e8a77',
        ownerId: '1fd5abe7-159e-4224-8a44-7ae3ee902a54',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
    },
    {
        title: 'Third story',
        description: 'this is the content',
        size: 3.4,
        columnId: 'f6209adb-91ca-476b-8269-asda82d05drt',
        id: 'asd75646-6666-41f5-9879-7d742f0e8ac5',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        boardId: '0f154e01-f8ba-49c8-b2dc-e884d28e7f83',
    },
]

const tasks = [
    {
        prettyId: 'KNBN-2',
        title: 'Add drag and drop function to cards',
        content: 'Add drag and drop function to cards',
        size: 1,
        columnId: 'f6209adb-91ca-476b-8269-328a82d05d4a',
        columnOrderNumber: 0,
        swimlaneOrderNumber: 1,
        id: 'f3f3c12d-cee0-46bf-9374-f19ba8894ad6',
        ownerId: '654df13f-51be-4b25-8f0e-7c2f40a3a81e',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
    },
    {
        prettyId: 'KNBN-3',
        title: 'Cypress test',
        content: 'add Cypress tests',
        size: 2,
        columnId: 'f6209adb-91ca-476b-8269-328a82d05d4a',
        columnOrderNumber: 2,
        swimlaneOrderNumber: 2,
        id: 'd29fc7da-93a1-40ec-8c56-7b619445465b',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
    },
    {
        prettyId: 'KNBN-5',
        title: 'Modify column styles',
        content: 'Make everything pretty',
        size: 9,
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        columnOrderNumber: 1,
        swimlaneOrderNumber: 4,
        id: 'f6209adb-91ca-476b-8269-328a82d05555',
        creatorId: '654df13f-51be-4b25-8f0e-7c2f40a3a81e',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
    },
    {
        prettyId: 'KNBN-1',
        title: 'Modify task styles',
        content: 'Add some pink',
        size: 2,
        columnId: 'f6209adb-91ca-476b-8269-328a82d05drt',
        columnOrderNumber: 1,
        swimlaneOrderNumber: 0,
        id: 'd39fc7da-93a1-40ec-8c56-7b619445465b',
        creatorId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
    },
    {
        prettyId: 'DEV-2',
        title: 'Create user model',
        content: 'Create user model',
        columnId: '7bce34e5-385b-41e6-acd3-ceb4bd57b4f6',
        columnOrderNumber: 2,
        swimlaneOrderNumber: 1,
        id: '6e766c63-0684-4cf2-8a46-868cfaf84033',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
    },
    {
        prettyId: 'DEV-1',
        title: 'Add subtasks',
        content: 'Add subtasks to tasks',
        columnId: '7bce34e5-385b-41e6-acd3-ceb4bd57b4f6',
        columnOrderNumber: 1,
        swimlaneOrderNumber: 0,
        id: 'e12d6ed1-c275-4047-8f3c-b50050bada6d',
        ownerId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        boardId: 'd3553f65-7ed4-4f43-9847-c14e4539eb5e',
    },
    {
        prettyId: 'KNBN-4',
        title: 'Test for columns',
        content: 'Add test for columns',
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        columnOrderNumber: 1,
        swimlaneOrderNumber: 3,
        id: 'b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
    },
    {
        prettyId: 'PO-1',
        title: 'Update user stories',
        content: 'Update user stories',
        columnId: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0527',
        columnOrderNumber: 0,
        swimlaneOrderNumber: 0,
        id: '7b29f130-fc89-4f16-b0ef-71a06e09110c',
        ownerId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
    },
]

const subtasks = [
    {
        prettyId: 'KNBN-8',
        name: 'subtask1',
        done: true,
        taskId: 'b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        columnOrderNumber: 2,
        id: '7ccd9f9b-a706-4fa7-a99c-d07136606840',
        columnId: 'f6209adb-91ca-476b-8269-328a82d05d41',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        content: 'subtaskin kontentti 11',
    },
    {
        prettyId: 'KNBN-9',
        name: 'subtask2',
        done: false,
        taskId: 'b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        columnOrderNumber: 2,
        id: '3345bb1f-c8dd-46f2-a099-a1e2c347ae88',
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        ownerId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        content: 'subtaskin kontentti 222',
    },
    {
        prettyId: 'KNBN-10',
        name: 'subtask3',
        done: true,
        taskId: 'b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        columnOrderNumber: 1,
        id: '6a752e4c-3254-49fa-a860-f1694b4e3fb9',
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        ownerId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        content: 'subtaskin kontentti 333',
    },
    {
        prettyId: 'KNBN-6',
        id: '5d689892-f627-4ae3-84ab-766d45532601',
        columnOrderNumber: 1,
        done: false,
        name: 'Test 1',
        content: '',
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        taskId: 'f6209adb-91ca-476b-8269-328a82d05555',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        ownerId: '6285867e-7db8-4769-8730-26d18ef9aba9',
    },
    {
        prettyId: 'KNBN-7',
        id: '5d689892-f627-4ae3-84ab-766d45532602',
        columnOrderNumber: 2,
        done: false,
        name: 'Test 2',
        content: '',
        columnId: 'ce175646-4035-41f5-99d7-7d742f0e8ac5',
        taskId: 'f6209adb-91ca-476b-8269-328a82d05555',
        boardId: '0f154e01-f8ba-49c8-b2dc-e374d28f7f83',
        ownerId: '6285867e-7db8-4769-8730-26d18ef9aba9',
    },
    {
        prettyId: 'PO-2',
        id: '5d689892-f627-4ae3-84ab-766d45532603',
        columnOrderNumber: 2,
        done: false,
        name: 'Update some more',
        content: '',
        columnId: '28d0ce05-b1e1-4c21-9c8a-87ba1b2a0528',
        taskId: '7b29f130-fc89-4f16-b0ef-71a06e09110c',
        boardId: '83fa4f89-8ea1-4d1c-9fee-321daa941485',
        ownerId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
    },

]

const colors = [
    { id: 'ca1b1793-e569-4fb3-8498-5a36406eeca6', color: 'yellow' },
    { id: 'f7606b69-3755-497b-9ed4-206ab0712198', color: 'green' },
    { id: '3e679a60-ef5d-4fd7-ab2c-b147ee22d7ab', color: 'red' },
    { id: 'adbb918c-de93-4a4c-8a1b-87af8afc2811', color: 'pink' },
    { id: '55c528bb-6200-4614-8177-653149de7306', color: 'purple' },
    { id: '4e935d81-665e-4efc-92b1-c22b05c5abd1', color: 'blue' },
    { id: '516f1621-718b-4cda-9e2d-05f16c865ea8', color: 'black' },
    { id: '9a965133-5817-42b3-8b3c-ce1c453e0b88', color: 'gray' },
    { id: '99d0f5f1-6ff4-4e02-a564-fad8f3726c27', color: 'lightgrey' },
]

const userStories = [
    {
        userId: '1fd5abe7-159e-4224-8a44-7ae3ee902a54',
        storyId: 'asd75646-6666-41f5-99d7-7d742f0e8ac5',
    },
    {
        userId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        storyId: 'asd75646-6666-41f5-99d7-7d742f0e8ac5',
    },
]

const usertasks = [
    {
        userId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        taskId: 'f3f3c12d-cee0-46bf-9374-f19ba8894ad6',
    },
    {
        userId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        taskId: 'f3f3c12d-cee0-46bf-9374-f19ba8894ad6',
    },
]

const colortasks = [
    {
        colorId: 'ca1b1793-e569-4fb3-8498-5a36406eeca6',
        taskId: 'f3f3c12d-cee0-46bf-9374-f19ba8894ad6'
    },
    {
        colorId: '3e679a60-ef5d-4fd7-ab2c-b147ee22d7ab',
        taskId: 'f3f3c12d-cee0-46bf-9374-f19ba8894ad6'
    },
    {
        colorId: '3e679a60-ef5d-4fd7-ab2c-b147ee22d7ab',
        taskId: 'd29fc7da-93a1-40ec-8c56-7b619445465b'
    },
    {
        colorId: '516f1621-718b-4cda-9e2d-05f16c865ea8',
        taskId: 'd29fc7da-93a1-40ec-8c56-7b619445465b'
    },
]

const colorsubtasks = [
    {
        colorId: 'adbb918c-de93-4a4c-8a1b-87af8afc2811',
        subtaskId: '6a752e4c-3254-49fa-a860-f1694b4e3fb9'
    },
    {
        colorId: '4e935d81-665e-4efc-92b1-c22b05c5abd1',
        subtaskId: '6a752e4c-3254-49fa-a860-f1694b4e3fb9'
    },
    {
        colorId: 'ca1b1793-e569-4fb3-8498-5a36406eeca6',
        subtaskId: '7ccd9f9b-a706-4fa7-a99c-d07136606840'
    },
    {
        colorId: 'f7606b69-3755-497b-9ed4-206ab0712198',
        subtaskId: '5d689892-f627-4ae3-84ab-766d45532601'
    },
]

const userSubtasks = [
    {
        userId: '6baba4dd-1ff4-4185-b8ff-1b735bc56576',
        subtaskId: '6a752e4c-3254-49fa-a860-f1694b4e3fb9',
    },
    {
        userId: '8b251e01-0bec-41bf-b756-ba53c76d04e6',
        subtaskId: '3345bb1f-c8dd-46f2-a099-a1e2c347ae88',
    },
]

module.exports = {
    projects, boards, columns, stories, tasks, subtasks, users, userStories, usertasks, userSubtasks, colors, colortasks, colorsubtasks
}

import groupsData from './groups.json'

const GROUPS_DATA: Group[] = groupsData

export const getGroups = (): Promise<GetGroupsResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ result: 1, data: GROUPS_DATA }), 1000),
  )
}

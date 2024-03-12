import { useState, useEffect } from 'react'
import { Select, Spinner, SimpleCell, Avatar } from '@vkontakte/vkui'
import { getGroups } from './api'

const App = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<string>('all')
  const [openFriendsList, setOpenFriendsList] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: GetGroupsResponse = await getGroups()
        if (response.result === 1) {
          setGroups(response.data || [])
        } else {
          console.error('Error fetching groups')
        }
      } catch (error) {
        console.error('Error fetching groups:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const toggleFriendsList = (groupId: number) => {
    setOpenFriendsList(openFriendsList === groupId ? null : groupId)
  }

  return (
    <div>
      <Select
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        options={[
          { value: 'all', label: 'All groups' },
          { value: 'closed', label: 'Closed groups' },
          { value: 'public', label: 'Public groups' },
        ]}
      />
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {groups
            .filter((group) => {
              if (filter === 'all') {
                return true
              } else if (filter === 'closed') {
                return group.closed
              } else if (filter === 'public') {
                return !group.closed
              }
              return true
            })
            .map((group) => (
              <SimpleCell
                key={group.id}
                after={
                  group.members_count && group.friends
                    ? `${group.members_count} members, ${group.friends.length} friends`
                    : group.members_count
                      ? `${group.members_count} members`
                      : group.friends
                        ? `${group.friends.length} friends`
                        : undefined
                }
                onClick={() => toggleFriendsList(group.id)}
              >
                {group.avatar_color && (
                  <Avatar
                    size={48}
                    style={{ backgroundColor: group.avatar_color }}
                  />
                )}
                <div>{group.name}</div>
                {group.closed && <div>Closed group</div>}
                {!group.closed && <div>Public group</div>}
                {openFriendsList === group.id && (
                  <div>
                    {group.friends &&
                      group.friends.map((friend) => (
                        <div key={`${friend.first_name}_${friend.last_name}`}>
                          {friend.first_name} {friend.last_name}
                        </div>
                      ))}
                  </div>
                )}
              </SimpleCell>
            ))}
        </div>
      )}
    </div>
  )
}

export default App

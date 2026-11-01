import { Search, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { RoleRecord, UserRecord } from '../../types';

interface UserRolePageProps {
  users: UserRecord[];
  roles: RoleRecord[];
  onCreateUser: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
}

export function UserRolePage({ users, roles, onCreateUser }: UserRolePageProps) {
  const [search, setSearch] = useState('');
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(term));
  }, [users, search]);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreateUser(userForm);
    setUserForm({ first_name: '', last_name: '', email: '', password: '' });
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="page-overline">ACCESS CONTROL</div>
          <h1>Users & Roles</h1>
          <p>Manage administrators and permission groups for the platform.</p>
        </div>
      </div>

      <div className="user-role-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Team members</h3>
              <p>Admins and staff accounts.</p>
            </div>
          </div>
          <div className="table-toolbar">
            <div className="search-field">
              <Search size={17} />
              <input placeholder="Search user name or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-chip">{user.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="side-forms">
          <form className="panel compact-form" onSubmit={handleCreateUser}>
            <div className="panel-heading">
              <div>
                <h3>Create user</h3>
                <p>Add a new admin or team member.</p>
              </div>
            </div>
            <div className="stacked-field">
              <label>First name</label>
              <input value={userForm.first_name} onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })} placeholder="Jane" />
            </div>
            <div className="stacked-field">
              <label>Last name</label>
              <input value={userForm.last_name} onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })} placeholder="Smith" />
            </div>
            <div className="stacked-field">
              <label>Email</label>
              <input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="jane@horigine.com" />
            </div>
            <div className="stacked-field">
              <label>Password</label>
              <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Enter password" />
            </div>
            <button type="submit" className="primary-btn">
              <UserPlus size={16} /> Create user
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

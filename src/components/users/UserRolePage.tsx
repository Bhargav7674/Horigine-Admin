import { Search, ShieldCheck, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { RoleRecord, UserRecord } from '../../types';

interface UserRolePageProps {
  users: UserRecord[];
  roles: RoleRecord[];
  onCreateUser: (payload: Partial<UserRecord>) => Promise<void>;
  onCreateRole: (payload: Partial<RoleRecord>) => Promise<void>;
}

export function UserRolePage({ users, roles, onCreateUser, onCreateRole }: UserRolePageProps) {
  const [search, setSearch] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'admin' });
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(term));
  }, [users, search]);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreateUser(userForm);
    setUserForm({ name: '', email: '', role: 'admin' });
  };

  const handleCreateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreateRole(roleForm);
    setRoleForm({ name: '', description: '' });
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
              <label>Name</label>
              <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div className="stacked-field">
              <label>Email</label>
              <input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="jane@horigine.com" />
            </div>
            <div className="stacked-field">
              <label>Role</label>
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button type="submit" className="primary-btn">
              <UserPlus size={16} /> Create user
            </button>
          </form>

          <form className="panel compact-form" onSubmit={handleCreateRole}>
            <div className="panel-heading">
              <div>
                <h3>Create role</h3>
                <p>Define access for a new permission group.</p>
              </div>
            </div>
            <div className="stacked-field">
              <label>Role name</label>
              <input value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} placeholder="Hiring Manager" />
            </div>
            <div className="stacked-field">
              <label>Description</label>
              <textarea rows={4} value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} placeholder="Can review applicants, update jobs and assign interviews." />
            </div>
            <button type="submit" className="primary-btn">
              <ShieldCheck size={16} /> Create role
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { MdDelete, MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

// Интерфейсы для пользователя
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

const UserDirectoryPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "company">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Блокировка скролла фона при открытом модальном окне
  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedUser]);

  const handleRowClick = (user: User) => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);
  const handleDeleteUser = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setUsers(users => users.filter(user => user.id !== id));
      setUserToDelete(null);
      setRemovingId(null);
    }, 250); // Длительность анимации
  };

  // Filter users by search
  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.company.name.toLowerCase().includes(q)
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = "";
    let bVal = "";
    if (sortBy === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortBy === "email") {
      aVal = a.email.toLowerCase();
      bVal = b.email.toLowerCase();
    } else if (sortBy === "company") {
      aVal = a.company.name.toLowerCase();
      bVal = b.company.name.toLowerCase();
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const pagedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);
  // Reset page if search or sort changes
  useEffect(() => { setPage(1); }, [search, sortBy, sortDir]);

  // Handle sort click
  const handleSort = (col: "name" | "email" | "company") => {
    if (sortBy === col) {
      setSortDir(dir => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center py-12">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight drop-shadow-sm">User Directory</h1>
      <div className="mb-6 w-full max-w-full flex justify-end">
        <input
          type="text"
          className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none text-slate-800 bg-white placeholder-slate-400"
          placeholder="Search by name, email or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-full mx-auto border border-slate-100">
          <p className="mb-6 text-slate-600 text-lg font-medium">Total users: <span className="font-bold text-slate-800">{sortedUsers.length}</span></p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 w-full">
              <thead>
                <tr className="text-left text-slate-700 text-base border-b border-slate-200">
                  <th className="px-5 py-3 font-semibold cursor-pointer select-none" onClick={() => handleSort("name")}>Name
                    {sortBy === "name" && (sortDir === "asc" ? <MdArrowDropUp className="inline text-xl align-middle" /> : <MdArrowDropDown className="inline text-xl align-middle" />)}
                  </th>
                  <th className="px-5 py-3 font-semibold cursor-pointer select-none" onClick={() => handleSort("email")}>Email
                    {sortBy === "email" && (sortDir === "asc" ? <MdArrowDropUp className="inline text-xl align-middle" /> : <MdArrowDropDown className="inline text-xl align-middle" />)}
                  </th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Website</th>
                  <th className="px-5 py-3 font-semibold cursor-pointer select-none" onClick={() => handleSort("company")}>Company
                    {sortBy === "company" && (sortDir === "asc" ? <MdArrowDropUp className="inline text-xl align-middle" /> : <MdArrowDropDown className="inline text-xl align-middle" />)}
                  </th>
                  <th className="px-5 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition rounded-lg outline-none ${removingId === user.id ? 'animate-fadeOut' : ''} ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-blue-50 focus-within:bg-blue-100 border-b border-slate-100`}
                    tabIndex={0}
                    aria-label={`Подробнее о пользователе ${user.name}`}
                    onClick={() => handleRowClick(user)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(user); }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 whitespace-nowrap">{user.name}</td>
                    <td className="px-5 py-3 text-blue-700 underline cursor-pointer whitespace-nowrap" onClick={e => { e.stopPropagation(); handleRowClick(user); }}>{user.email}</td>
                    <td className="px-5 py-3 text-slate-700 whitespace-nowrap">
                      {user.address.street}, {user.address.suite},<br />
                      {user.address.city}, {user.address.zipcode}
                    </td>
                    <td className="px-5 py-3 text-slate-700 whitespace-nowrap">{user.phone}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition" onClick={e => e.stopPropagation()}>{user.website}</a>
                    </td>
                    <td className="px-5 py-3 text-slate-700 whitespace-nowrap">{user.company.name}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition font-semibold focus:ring-2 focus:ring-red-300 focus:outline-none shadow-sm"
                        onClick={e => { e.stopPropagation(); setUserToDelete(user); }}
                        aria-label={`Delete user ${user.name}`}
                      >
                        <MdDelete className="text-lg" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >Previous</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded font-semibold ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  onClick={() => setPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >Next</button>
            </div>
          )}
        </div>
      )}
      {/* Модальное окно */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
      {/* Модальное окно подтверждения удаления */}
      {userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onCancel={() => setUserToDelete(null)}
          onConfirm={() => handleDeleteUser(userToDelete.id)}
        />
      )}
    </div>
  );
};

// Модальное окно для деталей пользователя
const UserModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  const mapUrl = `https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`;
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-modalIn outline-none border border-slate-100"
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{user.name}</h2>
        <div className="space-y-2 text-slate-700">
          <div><span className="font-semibold">Username:</span> {user.username}</div>
          <div><span className="font-semibold">Email:</span> <a href={`mailto:${user.email}`} className="text-blue-600 underline">{user.email}</a></div>
          <div><span className="font-semibold">Phone:</span> {user.phone}</div>
          <div><span className="font-semibold">Website:</span> <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{user.website}</a></div>
          <div><span className="font-semibold">Company:</span> {user.company.name}</div>
          <div>
            <span className="font-semibold">Address:</span> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
          </div>
          <div>
            <span className="font-semibold">Geo:</span> lat: {user.address.geo.lat}, lng: {user.address.geo.lng} {' '}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">View on map</a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s; }
        @keyframes modalIn { from { transform: translateY(40px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-modalIn { animation: modalIn 0.25s cubic-bezier(.4,2,.6,1) ; }
        @keyframes fadeOut { to { opacity: 0; transform: scale(0.98); } }
        .animate-fadeOut { animation: fadeOut 0.25s both; }
      `}</style>
    </div>
  );
};

// Модальное окно подтверждения удаления
const DeleteConfirmModal: React.FC<{ user: User; onCancel: () => void; onConfirm: () => void }> = ({ user, onCancel, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-modalIn outline-none border border-slate-100"
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
          onClick={onCancel}
          aria-label="Close modal"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Delete user?</h3>
        <p className="mb-6 text-slate-700">Are you sure you want to delete user <span className="font-semibold">{user.name}</span>?</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold focus:ring-2 focus:ring-slate-400 focus:outline-none"
            onClick={onCancel}
          >Cancel</button>
          <button
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold focus:ring-2 focus:ring-red-300 focus:outline-none"
            onClick={onConfirm}
          >Delete</button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s; }
        @keyframes modalIn { from { transform: translateY(40px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-modalIn { animation: modalIn 0.25s cubic-bezier(.4,2,.6,1) ; }
        @keyframes fadeOut { to { opacity: 0; transform: scale(0.98); } }
        .animate-fadeOut { animation: fadeOut 0.25s both; }
      `}</style>
    </div>
  );
};

export default UserDirectoryPage; 
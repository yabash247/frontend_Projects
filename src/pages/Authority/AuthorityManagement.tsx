// src/pages/AuthorityManagement.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendURL } from "../../utils/Constant"

interface Authority {
    id: number;
    model_name: string;
    company: string;
    requested_by: string;
    view : string;
    add  : string;
    edit : string;
    delete : string;
    accept  : string;
    approve  : string;
}

const AuthorityManagement: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const [authorities, setAuthorities] = useState<Authority[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null);
    const [form, setForm] = useState({
        model_name: '',
        company: '',
        requested_by: '',
        view : '',
        add  : '',
        edit : '',
        delete : '',
        accept  : '',
        approve  : '',
    });

    const accessToken = localStorage.getItem('accessToken') || ''; // Retrieve token from localStorage or state management

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Add token to the Authorization header
        },
    };

    const fetchAuthorities = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendURL}/api/company/authorities/${companyId}/`, axiosConfig); 
            setAuthorities(response.data);
        } catch (err) {
            setError('Failed to load authorities');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAuthority) {
                await axios.put(`${backendURL}/api/company/authorities/${editingAuthority.id}/`, form, axiosConfig);
            } else {
                await axios.post(backendURL +'/api/company/authorities/', form, axiosConfig);
            }
            fetchAuthorities();
            setForm({ model_name: '', company: '', requested_by: '', view: '', add: '', edit: '', delete: '', accept: '', approve: '' });
            setEditingAuthority(null);
        } catch (err) {
            setError('Failed to save authority');
        }
    };

    const handleEdit = (authority: Authority) => {
        setEditingAuthority(authority);
        setForm({
            model_name: authority.model_name,
            company: authority.company,
            requested_by: authority.requested_by,
            view: authority.view,
            add: authority.add,
            edit: authority.edit,
            delete: authority.delete,
            accept: authority.accept,
            approve: authority.approve,
        });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this authority?')) {
            try {
                await axios.delete(`${backendURL}/api/company/authorities/${id}/`, axiosConfig);
                fetchAuthorities();
            } catch (err) {
                setError('Failed to delete authority');
            }
        }
    };

    useEffect(() => {
        fetchAuthorities();
    }, []);

    return (
        <div>
            <h1>Authority Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Model Name</th>
                            <th>View</th>
                            <th>Add</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Accept</th>
                            <th>Approve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorities.map((auth) => (
                            <tr key={auth.id}>
                                <td>{auth.model_name}</td>
                                <td>{auth.view}</td>
                                <td>{auth.add}</td>
                                <td>{auth.edit}</td>
                                <td>{auth.delete}</td>
                                <td>{auth.accept}</td>
                                <td>{auth.approve}</td>
                                <td>
                                    <button onClick={() => handleEdit(auth)}>Edit</button>
                                    <button onClick={() => handleDelete(auth.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <form onSubmit={handleSubmit}>
                <h2>{editingAuthority ? 'Edit Authority' : 'Add Authority'}</h2>
                <input
                    type="text"
                    name="model_name"
                    placeholder="Model Name"
                    value={form.model_name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="requested_by"
                    placeholder="Requested By"
                    value={form.requested_by}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">{editingAuthority ? 'Update' : 'Create'}</button>
                {editingAuthority && (
                    <button type="button" onClick={() => setEditingAuthority(null)}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default AuthorityManagement;

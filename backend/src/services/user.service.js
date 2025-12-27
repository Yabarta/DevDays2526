const users = [{
    id: 1, name: 'Alice'
}, {
    id: 2, name: 'Bob'
}];

export const getAllUsers = () => {
    return users;
}

export const getUserById = (id) => {
    return users.find(user => user.id === id);
}

export const deleteUserById = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        return deletedUser;
    }
    return null;
}

export const createUser = (user) => {
    const newUser = {
        id: Math.random().toString(36).slice(2),
        name: user.name
    };
    users.push(newUser);
    return newUser;
}

export const updateUserById = (id, userData) => {
    const user = users.find(user => user.id === id);
    if (user) {
        user.name = userData.name || user.name;
        return user;
    }
    return null;
}
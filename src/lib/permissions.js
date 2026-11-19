export const NAV_PERMISSIONS = [
    { path: "/home", permission: "dashboard.view" },
    { path: "/books", permission: "books.view" },
    { path: "/bookcopy", permission: "book_copies.view" },
    { path: "/category", permission: "category.view" },
    { path: "/authors", permission: "authors.view" },
    { path: "/publishers", permission: "publishers.view" },
    { path: "/authorBooks", permission: "author_books.view" },
    { path: "/loansReturn", permission: "loans_return.view" },
    { path: "/loans", permission: "loans.view" },
    { path: "/loansDetail", permission: "loans_detail.view" },
    { path: "/bookReturn", permission: "book_return.view" },
    { path: "/user", permission: "users.view" },
    { path: "/member", permission: "member.view" },
    { path: "/fines", permission: "fines.view" },
    { path: "/finesPayment", permission: "fine_payments.view" },
];

/**
 * ស្វែងរក Path/ទំព័រដំបូងគេដែល User នោះមានសិទ្ធិចូលមើល (View Permission)
 * @param {Object} user 
 * @returns {string} Path ឧទាហរណ៍: '/home', '/loansReturn', '/books'
 */
export const getFirstAllowedPath = (user) => {
    if (!user) return '/login';
    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];

    // ប្រសិនបើមានសិទ្ធិមើល Dashboard
    if (permissions.includes('dashboard.view')) {
        return '/home';
    }

    // រកមើល Path ដំបូងគេដែល User មានសិទ្ធិ
    const firstAllowed = NAV_PERMISSIONS.find(item => permissions.includes(item.permission));
    if (firstAllowed) {
        return firstAllowed.path;
    }

    // បើគ្មានសិទ្ធិលើទំព័រណាមួយសោះ
    return '/unauthorized';
};

/**
 * ពិនិត្យមើលថាតើ User មានសិទ្ធិលើ Permission ជាក់លាក់ណាមួយដែរឬទេ
 * @param {Object} user 
 * @param {string} permission 
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
    if (!permission) return true;
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
};

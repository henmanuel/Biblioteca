import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const user = { id: 1, name: "admin", email: "admin@example.com" };

                if (
                    credentials.username === "admin" &&
                    credentials.password === "1234"
                ) {
                    return user;
                } else {
                    return null;
                }
            }

        })
    ],
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        signOut: '/auth/signout'
    }
});

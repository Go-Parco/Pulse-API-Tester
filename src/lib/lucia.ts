import { Lucia } from "lucia"
import type {
	Adapter,
	DatabaseSession,
	DatabaseUser,
} from "lucia/dist/database"

interface SessionAttributes {
	userId: string
	expiresAt: Date
}

interface UserAttributes {
	email: string
}

const sessions = new Map<string, DatabaseSession>()

const adapter: Adapter = {
	getSessionAndUser: async (
		sessionId: string
	): Promise<[DatabaseSession | null, DatabaseUser | null]> => {
		const session = sessions.get(sessionId)
		return session
			? [
					session,
					{
						id: "admin",
						attributes: {
							email: process.env.ADMIN_EMAIL!,
						},
					},
			  ]
			: [null, null]
	},
	getUserSessions: async (userId: string): Promise<DatabaseSession[]> => {
		return Array.from(sessions.values()).filter(
			(session) => session.userId === userId
		)
	},
	setSession: async (session: DatabaseSession): Promise<void> => {
		sessions.set(session.id, session)
	},
	deleteSession: async (sessionId: string): Promise<void> => {
		sessions.delete(sessionId)
	},
	updateSessionExpiration: async (
		sessionId: string,
		expiresAt: Date
	): Promise<void> => {
		const session = sessions.get(sessionId)
		if (session) {
			session.expiresAt = expiresAt
			sessions.set(sessionId, session)
		}
	},
	deleteUserSessions: async (userId: string): Promise<void> => {
		Array.from(sessions.entries())
			.filter(([_, session]) => session.userId === userId)
			.forEach(([id]) => sessions.delete(id))
	},
	deleteExpiredSessions: async (): Promise<void> => {
		const now = new Date()
		Array.from(sessions.entries())
			.filter(([_, session]) => session.expiresAt < now)
			.forEach(([id]) => sessions.delete(id))
	},
}

export const auth = new Lucia(adapter, {
	getUserAttributes: (data) => {
		return {
			email: data.email,
		}
	},
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
})

declare module "lucia" {
	interface Register {
		Lucia: typeof auth
		DatabaseUserAttributes: UserAttributes
		DatabaseSessionAttributes: SessionAttributes
	}
}

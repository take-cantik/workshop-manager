import { User } from '~/Domains/Entities/User'
import { UserRepositoryInterface } from '~/Domains/Repositories/UserRepository'
import { db } from '~/utils/firebase'
import { errorLogger } from '~/utils/util'

export class UserRepository implements UserRepositoryInterface {
  async getUser(lineId: string): Promise<User | null> {
    try {
      const res = await db.collection('users').doc(lineId).get()

      if (res.data()) {
        return {
          lineId: res.data()!.lineId,
          name: res.data()!.name,
          group: res.data()!.group
        }
      }

      return null
    } catch (err) {
      errorLogger(err)
      throw new Error('getUser')
    }
  }

  async addUser(user: User): Promise<void> {
    try {
      await db.collection('users').doc(user.lineId).set(user)
    } catch (err) {
      errorLogger(err)
      throw new Error('addUser')
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await db.collection('users').doc(user.lineId).update(user)
    } catch (err) {
      errorLogger(err)
      throw new Error('updateUser')
    }
  }

  async deleteUser(lineId: string): Promise<void> {
    try {
      await db.collection('users').doc(lineId).delete()
    } catch (err) {
      errorLogger(err)
      throw new Error('deleteUser')
    }
  }
}

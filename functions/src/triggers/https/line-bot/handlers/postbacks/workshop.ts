import { PostbackEvent } from '@line/bot-sdk'
import { WorkshopFirebaseRepository } from '~/repository/WorkshopFirebaseRepository'
import { lineClient } from '~/utils/line'
import { msgPending, msgRequest } from '~line/notice-messages/postbacks/workshop'

export const workshopHandler = async (event: PostbackEvent): Promise<void> => {
  const repository = new WorkshopFirebaseRepository()

  if (event.source.type === 'group') {
    const groupId = event.source.groupId
    const group = await lineClient.getGroupSummary(groupId)

    const activeWorkshop = await repository.getActiveWorkshop()

    if (activeWorkshop) {
      await repository.setWorkshop({
        groupId,
        groupName: group.groupName,
        status: 'pending'
      })

      await lineClient.pushMessage(activeWorkshop.groupId, msgRequest(group.groupName))
      await lineClient.replyMessage(event.replyToken, msgPending(activeWorkshop.groupName))
    } else {
      await repository.setWorkshop({
        groupId,
        groupName: group.groupName,
        status: 'active'
      })

      await lineClient.replyMessage(event.replyToken, { type: 'text', text: '完了' })
    }
  } else {
    await lineClient.replyMessage(event.replyToken, { type: 'text', text: 'こんなことはありえない' })
  }
}

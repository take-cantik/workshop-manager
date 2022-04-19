import { PostbackEvent } from '@line/bot-sdk'
import { StateRepository } from '~/Infrastructure/RepositoryImpl/Firebase/StateRepository'
import { lineClient } from '~/utils/line'
import { getData } from '~/utils/postback'
import { v4 as uuidv4 } from 'uuid'
import { msgBorrowKey, msgReturnKey } from '../../../notice-messages/richMenus/key'

export const richMenuKeyHandler = async (event: PostbackEvent): Promise<void> => {
  const stateRepository = new StateRepository()
  const data = getData(event)
  const uuid = uuidv4()
  const currentState = await stateRepository.getLatestState()

  if (data === '借りる') {
    await lineClient.replyMessage(event.replyToken, msgBorrowKey(currentState.isOpen, uuid))
  } else if (data === '返す') {
    await lineClient.replyMessage(event.replyToken, msgReturnKey(currentState.isOpen, uuid))
  } else if (data === '預ける') {
    // 処理が迷いまいまい
  }
}
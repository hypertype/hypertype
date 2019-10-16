import { ActionsCreator } from './ActionsCreator';
/**
 * Created by xamidylin on 06.07.2017.
 */
export class ArrayActionsCreator<T> extends ActionsCreator<T[]> {

	public CREATE_ACTION = `add`;
	public UPDATE_ACTION = `update`;
	public DELETE_ACTION = `delete`;
	public DELETE_FROM_SERVER_ACTION = `update.delete`;
	public DIFF_ACTION = `update.diff`;

	public Diff(diff) {
		return this.Action({
			type: this.DIFF_ACTION,
			payload: diff
		})
	}

	public Create(item) {
		return this.Action({
			type: this.CREATE_ACTION,
			payload: Object.assign({$id: +new Date()}, item)
		})
	}

	public Update(item: T, action = 'set') {
		return this.Action({
			type: `${this.UPDATE_ACTION}.${action}`,
			payload: item
		})
	}

	public Delete(id) {
		return this.Action({
			type: this.DELETE_ACTION,
			payload: {
				$id: id
			}
		})

	}

}

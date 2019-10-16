import {suite, test, timeout} from "@hypertype/tools/test";
import {first} from "@hypertype/core";
import {NodeWebSocketService} from "../node.web-socket.service";
import {NodeFetchService} from "../nodeFetchService";

@suite
export class NodeWebsocketSpec {

    @test()
    async connectWebSocket() {
        const service = new NodeWebSocketService();
        const inv = await service.Hub('Inventory').messages$.pipe(
            first()
        ).toPromise();
        console.log(inv)
    }

}
import { Injectable, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Injectable()
export class MessageSignalrService extends AppComponentBase {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    worbbyTaskMessageHub: any;

    sendMessage(messageData, callback): void {
        if ($.connection.hub.state !== $.signalR.connectionState.connected) {
            callback && callback();
            abp.notify.warn(this.l('MessageIsNotConnectedWarning'));
            return;
        }

        this.worbbyTaskMessageHub.server.sendMessage(messageData).done(result => {
            if (result) {
                abp.notify.warn(result);
            }
        }).always(() => {
            callback && callback();
        });
    }

    init(): void {
        this.worbbyTaskMessageHub = ($.connection as any).worbbyTaskMessageHub;

        if (!this.worbbyTaskMessageHub) {
            return;
        }

        $.connection.hub.stateChanged(data => {
            if (data.newState === $.connection.connectionState.connected) {
                abp.event.trigger('app.message.connected');
            }
        });

        this.worbbyTaskMessageHub.client.getChatMessage = message => {
            abp.event.trigger('app.message.messageReceived', message);
        };

        this.worbbyTaskMessageHub.client.getUserConnectNotification = (friend, isConnected) => {
            abp.event.trigger('app.message.userConnectionStateChanged',
                {
                    friend: friend,
                    isConnected: isConnected
                });
        };

        this.worbbyTaskMessageHub.client.getUserStateChange = (friend, state) => {
            abp.event.trigger('app.message.userStateChanged',
                {
                    friend: friend,
                    state: state
                });
        };

        this.worbbyTaskMessageHub.client.getallUnreadMessagesOfUserRead = friend => {
            abp.event.trigger('app.message.allUnreadMessagesOfUserRead',
                {
                    friend: friend
                });
        };
    }
}
// services/rocketChat.service.ts
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { delay, tap, retry, filter, map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

interface RocketChatMessage {
  msg:
    | "method"
    | "result"
    | "connected"
    | "ping"
    | "pong"
    | "sub"
    | "ready"
    | "changed"
    | "connect";
  method?: string;
  id?: string;
  params?: any[];
  collection?: string;
  fields?: any;
  name?: string;
  error?: any;
  version?: string;
  support?: string[];
  session?: string;
}

export class RocketChatService {
  private socket$: WebSocketSubject<RocketChatMessage>;
  private messageStream$ = new Subject<any>();
  private messageId = 0;
  private url: string;
  private authToken: string;

  constructor(
    token: string,
    serverUrl: string = "wss://45-159-248-44.nip.io/websocket"
  ) {
    this.url = serverUrl;
    this.updateAuthToken(token);
    this.connect();
  }

  public updateAuthToken(token: string) {
    this.authToken = token;
  }

  private connect() {
    this.socket$ = new WebSocketSubject<RocketChatMessage>({
      url: this.url,
      openObserver: {
        next: () => {
          console.log("Connected to Rocket.Chat");
          this.sendConnectMessage();
          this.authenticate();
          // You might need to send authentication here
        },
      },
      closeObserver: {
        next: () => {
          console.log("Disconnected from Rocket.Chat");
          // Implement reconnection logic if needed
        },
      },
    });

    // Handle incoming messages
    this.socket$
      .pipe(
        retry({
          delay: (errors) =>
            errors?.pipe(
              tap((err) => console.error("WebSocket error: 1", err)),
              delay(5000) // Reconnect after 5 seconds
            ),
        })
      )
      .subscribe({
        next: (msg) => this.handleMessage(msg),
        error: (err) => console.error("WebSocket error: 2", err),
        complete: () => console.log("Connection closed"),
      });
  }

  private sendConnectMessage(): void {
    const connectMessage: RocketChatMessage = {
      msg: "connect",
      version: "1", // Use protocol version 1
      support: ["1"], // Supported protocol versions
    };

    // If we have an existing session (from previous connection), add it
    if (this.authToken) {
      connectMessage.session = this.authToken;
    }

    this.socket$.next(connectMessage);
  }

  private authenticate(): void {
    if (!this.authToken) {
      console.warn(
        "No auth token available. Connecting without authentication."
      );
      return;
    }

    const authId = (++this.messageId).toString();
    const authMessage: RocketChatMessage = {
      msg: "method",
      method: "login",
      id: authId,
      params: [{ resume: this.authToken }],
    };

    this.socket$.next(authMessage);
  }

  public subscribeToRoom(roomId: string): Observable<any> {
    const subId = (++this.messageId).toString();

    // Subscribe to the room's stream
    this.socket$.next({
      msg: "sub",
      id: subId,
      name: "stream-room-messages",
      params: [roomId, false],
    });

    // Subscribe to room changes (optional)
    this.socket$.next({
      msg: "sub",
      id: (++this.messageId).toString(),
      name: "stream-notify-room",
      params: [`${roomId}/typing`, false],
    });

    // Return an observable filtered for this room's messages
    return this.messageStream$.pipe(
      filter(
        (message: any) =>
          message.collection === "stream-room-messages" &&
          message.fields?.args[0]?.rid === roomId
      ),
      map((message) => message.fields.args[0])
    );
  }

  private handleMessage(msg: RocketChatMessage) {
    switch (msg.msg) {
      case "connected":
        console.log(
          "Successfully connected to Rocket.Chat with session:",
          msg.session
        );
        // If we have an auth token, authenticate now
        if (this.authToken) {
          this.authenticate();
        }
      case "changed":
        // Handle subscription updates
        if (msg.collection === "stream-room-messages") {
          this.messageStream$.next(msg);
        }
        break;
      case "connected":
        console.log("Successfully connected to Rocket.Chat");
        break;
      case "result":
        console.log("Method result:", msg);
        // Handle authentication result
        if (msg.id === this.messageId.toString() && msg.method === "login") {
          if (msg.error) {
            console.error("Authentication failed:", msg.error);
          } else {
            console.log("Authentication successful");
          }
        }
        break;
      case "ping":
        this.socket$.next({ msg: "pong" });
        break;
      default:
        console.log("Received message:", msg);
    }
  }

  public sendMessage(roomId: string, messageText: string) {
    const messageId = (++this.messageId).toString();
    const message: RocketChatMessage = {
      msg: "method",
      method: "sendMessage",
      id: messageId,
      params: [
        {
          _id: this.generateRandomId(), // Rocket.Chat expects a unique ID
          rid: roomId,
          msg: messageText,
        },
      ],
    };

    this.socket$.next(message);
    return messageId; // Return the ID to track responses
  }

  private generateRandomId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  public disconnect() {
    this.socket$.complete();
  }
}

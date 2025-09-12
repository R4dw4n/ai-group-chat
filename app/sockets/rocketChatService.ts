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

interface FileUploadResponse {
  success: boolean;
  file?: {
    _id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  };
  error?: string;
}

interface ImageMessage {
  _id: string;
  rid: string;
  msg: string;
  attachments?: Array<{
    _id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    image_url?: string;
    image_type?: string;
    image_size?: number;
  }>;
}

export class RocketChatService {
  private socket$: WebSocketSubject<RocketChatMessage>;
  private messageStream$ = new Subject<any>();
  private isConnected$ = new Subject<boolean>();
  private messageId = 0;
  private url: string;
  private authToken: string;
  private username: string;
  private baseUrl: string; // HTTP base URL for file uploads
  private userId: string;
  constructor(
    token: string,
    username: string,
    userId: string,
    serverUrl: string = "wss://45-159-248-44.nip.io/websocket"
  ) {
    this.url = serverUrl;
    this.baseUrl = serverUrl.replace('wss://', 'https://').replace('/websocket', '');
    this.username = username;
    this.userId = userId;
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
          this.isConnected$.next(false);
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

  public isConnected() {
    return this.isConnected$.asObservable();
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
    // this.socket$.next({
    //   msg: "sub",
    //   id: (++this.messageId).toString(),
    //   name: "stream-notify-room",
    //   params: [`${roomId}/typing`, false],
    // });

    // Return an observable filtered for this room's messages
    return this.messageStream$.pipe(
      filter(
        (message: any) =>
          message.collection === "stream-room-messages" &&
          message.fields?.args[0]?.u?.username !== this.username &&
          message.fields?.args[0]?.rid === roomId
      ),
      map((message) => message.fields.args[0])
    );
  }

  private handleMessage(msg: RocketChatMessage) {
    switch (msg.msg) {
      case "connected":
        this.isConnected$.next(true);
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
      case "result":
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

  /**
   * Upload a file to Rocket.Chat server
   * @param file - The file to upload
   * @param roomId - The room ID where the file will be sent
   * @returns Promise with upload response
   */
  public async uploadFile(file: File, roomId: string): Promise<FileUploadResponse> {
    try {
      // Validate file type and size
      if (!this.validateFile(file)) {
        return {
          success: false,
          error: 'Invalid file type or size. Only images up to 10MB are allowed.'
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('msg', '');
      formData.append('type', 'image');

      const response = await fetch(`${this.baseUrl}/api/v1/rooms.media/${roomId}`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': this.authToken,
          'X-User-Id': this.userId,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          file: {
            _id: result.file._id,
            name: result.file.name,
            type: result.file.type,
            size: result.file.size,
            url: result.file.url,
          },
        };
      } else {
        return {
          success: false,
          error: result.error || 'Upload failed',
        };
      }
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: 'Network error during upload',
      };
    }
  }

  /**
   * Send an image message to a room
   * @param roomId - The room ID
   * @param file - The image file to send
   * @param caption - Optional caption for the image
   * @returns Promise with message ID
   */
  public async sendImage(roomId: string, file: File, caption: string = ''): Promise<string> {
    return null;
    try {
      // First upload the file
      const uploadResult = await this.uploadFile(file, roomId);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Then send the message with the uploaded file as attachment
      const messageId = (++this.messageId).toString();
      const imageMessage: RocketChatMessage = {
        msg: "method",
        method: "sendMessage",
        id: messageId,
        params: [
          {
            _id: this.generateRandomId(),
            rid: roomId,
            msg: caption || '', // Caption or empty string
            attachments: [
              {
                _id: uploadResult.file._id,
                name: uploadResult.file.name,
                type: uploadResult.file.type,
                size: uploadResult.file.size,
                url: uploadResult.file.url,
                image_url: uploadResult.file.url,
                image_type: uploadResult.file.type,
                image_size: uploadResult.file.size,
              }
            ],
          } as ImageMessage,
        ],
      };

      this.socket$.next(imageMessage);
      return messageId;
    } catch (error) {
      console.error('Send image error:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @returns boolean indicating if file is valid
   */
  private validateFile(file: File): boolean {
    // Check file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file size (max 10MB)
    // const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    // if (file.size > maxSize) {
    //   return false;
    // }

    return true;
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

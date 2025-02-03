import { io, Socket } from 'socket.io-client';

interface SystemMetrics {
  ramUsage: number;
  freeMemory: number;
  onlineViewers: number;
  bandwidth?: {
    download: number;
    upload: number;
  };
  latency?: number;
}

class MonitoringService {
  private socket: Socket | null = null;
  private metrics: SystemMetrics = {
    ramUsage: 0,
    freeMemory: 0,
    onlineViewers: 0
  };

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    console.log('Initializing monitoring socket connection...');
    this.socket = io('http://localhost:3001/monitoring', {
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Monitoring socket connected');
    });

    this.socket.on('metrics', (data: SystemMetrics) => {
      console.log('Received metrics update:', data);
      this.metrics = data;
    });
  }

  public getMetrics(): SystemMetrics {
    return this.metrics;
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}

export const monitoringService = new MonitoringService();
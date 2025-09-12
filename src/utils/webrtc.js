// WebRTC utilities for peer-to-peer connections
import Peer from 'simple-peer';

export class WebRTCManager {
  constructor() {
    this.localStream = null;
    this.peers = new Map();
    this.socket = null;
  }

  // Initialize media devices
  async initializeMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Create a peer connection
  createPeer(initiator, stream, socketId) {
    const peer = new Peer({
      initiator,
      stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    this.peers.set(socketId, peer);
    return peer;
  }

  // Get all connected peers
  getPeers() {
    return Array.from(this.peers.values());
  }

  // Remove a peer
  removePeer(socketId) {
    const peer = this.peers.get(socketId);
    if (peer) {
      peer.destroy();
      this.peers.delete(socketId);
    }
  }

  // Clean up all connections
  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.peers.forEach(peer => peer.destroy());
    this.peers.clear();
  }

  // Toggle video
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  // Toggle audio
  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  // Get media state
  getMediaState() {
    if (!this.localStream) return { video: false, audio: false };
    
    const videoTrack = this.localStream.getVideoTracks()[0];
    const audioTrack = this.localStream.getAudioTracks()[0];
    
    return {
      video: videoTrack ? videoTrack.enabled : false,
      audio: audioTrack ? audioTrack.enabled : false
    };
  }
}

export default WebRTCManager;
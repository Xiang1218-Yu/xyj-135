import { useEffect, useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/useOfficeStore';
import {
  createAudioEngine,
  initAudioContext,
  startAllSounds,
  stopAllSounds,
  updateListenerPos,
  updateMasterVolume,
  updateIsMuted,
  processColleagueSoundEvents,
  getContextState,
} from '@/audio/audioEngine';
import { updateAllSoundVolumes } from '@/audio/audioPlayer';
import type { AudioEngine } from '@/audio/audioEngine';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine>(createAudioEngine());

  const { audioSources, colleagues, listenerPosition, masterVolume, isMuted, isPlaying, colleagueSoundEvents, consumeColleagueSoundEvent } = useOfficeStore();

  useEffect(() => {
    updateListenerPos(engineRef.current, listenerPosition, audioSources);
  }, [listenerPosition, audioSources]);

  useEffect(() => {
    updateMasterVolume(engineRef.current, masterVolume, audioSources);
  }, [masterVolume, audioSources]);

  useEffect(() => {
    updateIsMuted(engineRef.current, isMuted, audioSources);
  }, [isMuted, audioSources]);

  const handleInitAudioContext = useCallback(() => {
    return initAudioContext(engineRef.current);
  }, []);

  const handleStartAllSounds = useCallback(() => {
    startAllSounds(engineRef.current, audioSources, colleagues);
  }, [audioSources, colleagues]);

  const handleStopAllSounds = useCallback(() => {
    stopAllSounds(engineRef.current);
  }, []);

  const handleUpdateAllSoundVolumes = useCallback(() => {
    updateAllSoundVolumes(getContextState(engineRef.current), engineRef.current.loopSounds, audioSources);
  }, [audioSources]);

  useEffect(() => {
    if (!isPlaying) return;
    handleInitAudioContext();

    processColleagueSoundEvents(
      engineRef.current,
      colleagueSoundEvents.map(e => ({ id: e.id, position: e.position, soundType: e.soundType })),
      consumeColleagueSoundEvent
    );
  }, [colleagueSoundEvents, isPlaying, handleInitAudioContext, consumeColleagueSoundEvent]);

  useEffect(() => {
    if (isPlaying) {
      handleStartAllSounds();
    } else {
      handleStopAllSounds();
    }

    return () => {
      handleStopAllSounds();
    };
  }, [isPlaying, handleStartAllSounds, handleStopAllSounds]);

  useEffect(() => {
    handleUpdateAllSoundVolumes();
  }, [audioSources, handleUpdateAllSoundVolumes]);

  return {
    initAudioContext: handleInitAudioContext,
    startAllSounds: handleStartAllSounds,
    stopAllSounds: handleStopAllSounds,
    updateAllSoundVolumes: handleUpdateAllSoundVolumes,
    isAudioReady: !!engineRef.current.audioContext,
  };
}

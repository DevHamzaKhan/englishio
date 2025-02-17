import AudioRecorder from './components/audio-recorder';

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold text-center mb-12">IB English IO Grader</h1>
      <AudioRecorder />
    </main>
  );
}
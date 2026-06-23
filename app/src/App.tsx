import { useEffect } from 'react';
import { useRoute, parseRoute } from './router';
import { HUD } from './components/HUD';
import { Home } from './screens/Home';
import { Lesson } from './screens/Lesson';
import { Exam } from './screens/Exam';
import { Library } from './screens/Library';
import { Profile } from './screens/Profile';
import { BottomNav } from './components/BottomNav';
import { useSettings } from './store/settings';

export function App() {
  const hash = useRoute();
  const { name, params } = parseRoute(hash);
  const theme = useSettings((s) => s.theme);

  // ensure theme class is applied on first paint
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const inLesson = name === 'lesson' || name === 'exam';

  return (
    <>
      <div className="aurora" />
      {!inLesson && <HUD />}
      <main>
        {name === 'lesson' && params[0] ? (
          <Lesson lessonId={params[0]} />
        ) : name === 'exam' ? (
          <Exam />
        ) : name === 'library' ? (
          <Library />
        ) : name === 'profile' ? (
          <Profile />
        ) : (
          <Home />
        )}
      </main>
      {!inLesson && <BottomNav active={name} />}
    </>
  );
}

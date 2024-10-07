import { JsonCodeEditor } from '../../../components/json-code-editor/json-code-editor.tsx';
import { useOutletContext } from 'react-router-dom';

export const EditFile = () => {
  const { value, onChange } = useOutletContext<{ value: string; onChange: (value: string) => void }>();

  return (
    <div className="py-2 max-h-[calc(100vh-360px)] overflow-y-auto">
      <JsonCodeEditor value={value} onChange={onChange}/>
    </div>
  );
}
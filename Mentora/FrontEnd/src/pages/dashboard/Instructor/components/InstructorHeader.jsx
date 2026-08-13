import { Link } from 'react-router-dom';

export function InstructorHeader() {
  return (
    <div className="dashboard-instructor__topbar">
      <p className="dashboard-instructor__role">Instructor</p>
      <Link to="/cursos/nuevo" className="dashboard-instructor__create-action">Crear curso</Link>
    </div>
  );
}

const Curso = require("../models/Cursos");

exports.getDashboardInstructor = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }
    
    const cursos = await Curso.find({ instructorID: req.user.id })
      .select("titulo imagen nivel categoria precio publicado calificacion_promedio total_inscritos")
      .sort("-createdAt");

    // Manejar valores null/undefined en las propiedades de los cursos
    const totalEstudiantes = cursos.reduce((sum, c) => sum + (c.total_inscritos || 0), 0);
    const cursosConCalificacion = cursos.filter(c => typeof c.calificacion_promedio === 'number' && c.calificacion_promedio > 0);
    const promedioGlobal = cursosConCalificacion.length > 0
      ? Math.round((cursosConCalificacion.reduce((sum, c) => sum + c.calificacion_promedio, 0) / cursosConCalificacion.length) * 10) / 10
      : 0;

    return res.status(200).json({
      success: true,
      resumen: {
        total_cursos: cursos.length,
        cursos_publicados: cursos.filter(c => c.publicado).length,
        total_estudiantes: totalEstudiantes,
        calificacion_promedio_global: promedioGlobal
      },
      cursos: cursos.map(c => ({
        ...c.toObject(),
        total_inscritos: c.total_inscritos || 0,
        calificacion_promedio: c.calificacion_promedio || 0
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardEstudiante = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }
    
    const Inscripcion = require("../models/Inscripciones");

    const inscripciones = await Inscripcion.find({ estudiante_id: req.user.id })
      .populate("curso_id", "titulo imagen nivel categoria precio instructorID")
      .populate({
        path: "curso_id",
        populate: { path: "instructorID", select: "nombre foto" }
      })
      .select("curso_id porcentaje fecha_inscripcion progreso")
      .sort("-fecha_inscripcion");

    const totalCursos = inscripciones.length;
    const cursosCompletados = inscripciones.filter(i => i.porcentaje === 100).length;
    const progresoPromedio = totalCursos > 0
      ? Math.round(inscripciones.reduce((sum, i) => sum + (i.porcentaje || 0), 0) / totalCursos)
      : 0;

    return res.status(200).json({
      success: true,
      resumen: {
        total_cursos: totalCursos,
        cursos_completados: cursosCompletados,
        progreso_promedio: progresoPromedio
      },
      inscripciones: inscripciones.map(i => ({
        ...i.toObject(),
        porcentaje: i.porcentaje || 0
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
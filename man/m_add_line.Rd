% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/add.R
\name{m_add_line}
\alias{m_add_line}
\title{Add Line Between Points}
\usage{
m_add_line(id, start, end, dashed = FALSE, spec = m_shape_spec())
}
\arguments{
\item{id}{R3dmol \code{id} or a \code{r3dmol} object (the output from
\code{r3dmol()})}

\item{start}{Start location of line Can be either \code{m_sel()} or
\code{m_vector3()}.}

\item{end}{End location of line. Can be either \code{m_sel()} or
\code{m_vector3()}.}

\item{dashed}{Boolean, whether or not to draw line as dashed.}

\item{spec}{Additional shape specifications defined with
\code{m_shape_spec()}.}
}
\description{
Adds a line between the given points.
}
\examples{
r3dmol() \%>\%
  m_add_model(data = pdb_6zsl) \%>\%
  m_set_style(style = m_style_cartoon()) \%>\%
  m_zoom_to() \%>\%
  m_add_style(
    sel = m_sel(resi = 1:10),
    style = c(
      m_style_stick(),
      m_style_sphere(scale = 0.3)
    )
  ) \%>\%
  m_add_line(
    start = m_sel(
      resi = 1:10,
      chain = "A"
    ),
    end = m_sel(
      resi = 1:10,
      chain = "B"
    )
  ) \%>\%
  m_add_label(
    text = "The middle of the selection",
    sel = m_sel(resi = 1:10)
  )
}

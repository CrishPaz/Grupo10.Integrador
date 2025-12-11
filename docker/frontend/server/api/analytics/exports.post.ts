import ExcelJS from 'exceljs'
import puppeteer from 'puppeteer'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { data, format, reportType } = body

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Reporte')

    if (data && data.length > 0) {
      // Add Headers
      const headers = Object.keys(data[0])
      worksheet.addRow(headers.map(h => h.toUpperCase().replace(/_/g, ' ')))

      // Add Data
      data.forEach((row: any) => {
        worksheet.addRow(Object.values(row))
      })

      // Style Header
      worksheet.getRow(1).font = { bold: true }
    }

    const buffer = await workbook.xlsx.writeBuffer()

    setResponseHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename=reporte.xlsx')

    return buffer
  }

  if (format === 'pdf') {
    let browser
    try {
      browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()

      let htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Reporte: ${reportType ? reportType.toUpperCase().replace(/_/g, ' ') : 'General'}</h1>
            <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  ${data.length > 0 ? Object.keys(data[0]).map(k => `<th>${k.toUpperCase().replace(/_/g, ' ')}</th>`).join('') : ''}
                </tr>
              </thead>
              <tbody>
                ${data.map((row: any) => `
                  <tr>
                    ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `

      await page.setContent(htmlContent)
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })

      await browser.close()

      setResponseHeader(event, 'Content-Type', 'application/pdf')
      setResponseHeader(event, 'Content-Disposition', 'attachment; filename=reporte.pdf')

      return pdfBuffer
    } catch (error) {
      if (browser) await browser.close()
      console.error('PDF Generation Error:', error)
      throw createError({ statusCode: 500, message: 'Error generating PDF: ' + error.message })
    }
  }

  return { error: 'Format not supported' }
})
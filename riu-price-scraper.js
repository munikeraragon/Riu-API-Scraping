const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://www.riu.com/consultar-disponibilidad!execute.action?v=web2017&formato=json&idioma=en&tipoBusqueda=TIPO_BUSQUEDA_HOTEL&codigoPromocional=&paisDestino.pais=USA&paisDestino.id_pais=US&paisDestino.destino=DWMIA&paisDestino.destino_name=Miami%20Beach&paisDestino.id_destino=Miami%20Beach&paisDestino.hotel=5724&paisDestino.hotel_name=Hotel%20Riu%20Plaza%20Miami%20Beach&huespedes.habitaciones[0].numeroAdultos=2&huespedes.habitaciones[0].numeroNinos=0&huespedes.numeroHabitaciones=1&numeroAdultosTotal=2&numeroNinosTotal=0&dateFormat.formato=MM/DD/YYYY&fechas.fechaEntradaAsString=09/26/2025&fechas.fechaSalidaAsString=10/03/2025&fechaEntradaMs=1758870000000&fechaSalidaMs=1759474800000&frontendData.sesionActivaRC=false&cajaBusquedaEnHomeForm.imagenHabitacion=0';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the API URL and get the JSON response
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    const body = await response.text();

    try {
        const json = JSON.parse(body);
        console.log('Full Response:', json);
        // Try to get price from codigosTracking or codigosTC
        const priceTracking = json.codigosTracking?.search_min_price_hotel;
        const priceTC = json.codigosTC?.search_hotel_price;
        const currencyTracking = json.codigosTracking?.search_min_price_currency || 'USD';
        const currencyTC = json.codigosTC?.search_min_price_currency || 'USD';
        if (priceTracking) {
            console.log(`Total Price (codigosTracking): ${priceTracking} ${currencyTracking}`);
        }
        if (priceTC) {
            console.log(`Total Price (codigosTC): ${priceTC} ${currencyTC}`);
        }
        if (!priceTracking && !priceTC) {
            console.log('Price not found');
        }
    } catch (e) {
        console.error('Error parsing response:', e.message);
    }

    await browser.close();
})();
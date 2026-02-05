# Sistema de Citas Médicas v1 - Invocación Directa de Lambdas

## Descripción

Este proyecto implementa un sistema de gestión de citas médicas usando AWS Lambda con el patrón de **invocación directa entre funciones Lambda**. La arquitectura permite procesar citas médicas para diferentes países (Perú, Chile y Colombia) utilizando el servicio Lambda Invoke de AWS.

## Arquitectura

El sistema consta de 4 funciones Lambda:

- **appointment**: Función principal que recibe los datos de la cita y determina a qué país pertenece, invocando directamente a la función Lambda correspondiente.
- **appointmentPe**: Procesa citas médicas para Perú (PE)
- **appointmentCl**: Procesa citas médicas para Chile (CL)
- **appointmentCo**: Procesa citas médicas para Colombia (CO)

### Flujo de Trabajo

1. La función `appointment` recibe un evento con los datos de la cita médica
2. Basándose en el campo `countryISO`, determina qué función Lambda invocar
3. Invoca directamente la función Lambda del país correspondiente usando el SDK de AWS
4. Espera la respuesta y la retorna al cliente

## Estructura del Evento

```json
{
  "slotId": 123,
  "patientId": 456,
  "date": "2026-02-15",
  "countryISO": "PE"
}
```

## Tecnologías Utilizadas

- **AWS Lambda**: Funciones serverless para procesamiento
- **Node.js 22.x**: Runtime de ejecución
- **TypeScript**: Lenguaje de programación
- **Serverless Framework**: Despliegue e infraestructura como código
- **esbuild**: Bundling y minificación

## Permisos IAM

La función principal requiere permisos para:
- `lambda:InvokeFunction`: Invocar otras funciones Lambda

## Instalación

```bash
# Instalar dependencias
npm install

# Desplegar a AWS
sls deploy

# Desplegar a un stage específico
sls deploy --stage prod
```

## Variables de Entorno

- `FUNCTION_NAME_PE`: ARN de la función Lambda para Perú
- `FUNCTION_NAME_CL`: ARN de la función Lambda para Chile
- `FUNCTION_NAME_CO`: ARN de la función Lambda para Colombia

## Ventajas de esta Arquitectura

✅ Comunicación síncrona directa entre Lambdas
✅ Respuesta inmediata al cliente
✅ Arquitectura simple y directa

## Desventajas

❌ Acoplamiento fuerte entre funciones
❌ Consumo de tiempo de ejecución mientras espera respuesta
❌ Posible cascada de errores

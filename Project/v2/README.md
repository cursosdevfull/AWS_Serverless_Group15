# Sistema de Citas Médicas v2 - Arquitectura con SQS

## Descripción

Este proyecto implementa un sistema de gestión de citas médicas usando AWS Lambda y **Amazon SQS (Simple Queue Service)**. Esta versión mejora la arquitectura de la v1 al desacoplar las funciones Lambda mediante colas de mensajes, implementando un patrón asíncrono y tolerante a fallos.

## Arquitectura

El sistema consta de:

### Funciones Lambda

- **appointment**: Función principal que recibe los datos de la cita y envía mensajes a la cola SQS correspondiente según el país
- **appointmentPe**: Procesa citas médicas para Perú desde la cola `sqs-pe`
- **appointmentCl**: Procesa citas médicas para Chile desde la cola `sqs-cl`
- **appointmentCo**: Procesa citas médicas para Colombia desde la cola `sqs-co`

### Recursos AWS

- **3 Colas SQS**: Una por cada país (sqs-pe, sqs-cl, sqs-co)
- **VisibilityTimeout**: 300 segundos (5 minutos) por cola

### Flujo de Trabajo

1. La función `appointment` recibe un evento con los datos de la cita médica
2. Basándose en el campo `countryISO`, determina a qué cola SQS enviar el mensaje
3. Envía el mensaje a la cola SQS correspondiente
4. Retorna inmediatamente al cliente
5. Las funciones específicas por país son invocadas automáticamente cuando hay mensajes en sus colas
6. Procesan la cita médica de forma asíncrona

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
- **Amazon SQS**: Colas de mensajes para comunicación asíncrona
- **Node.js 22.x**: Runtime de ejecución
- **TypeScript**: Lenguaje de programación
- **Serverless Framework**: Despliegue e infraestructura como código
- **esbuild**: Bundling y minificación

## Permisos IAM

La función principal requiere permisos para:
- `sqs:SendMessage`: Enviar mensajes a las colas SQS

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

- `SQS_URL_PE`: URL de la cola SQS para Perú
- `SQS_URL_CL`: URL de la cola SQS para Chile
- `SQS_URL_CO`: URL de la cola SQS para Colombia

## Ventajas de esta Arquitectura

✅ Desacoplamiento entre productores y consumidores
✅ Procesamiento asíncrono
✅ Tolerancia a fallos con reintentos automáticos
✅ Escalabilidad independiente por país
✅ Buffer de mensajes en caso de alta carga
✅ Menor costo de ejecución (no se espera respuesta)

## Desventajas

❌ No hay respuesta inmediata del procesamiento
❌ Mayor complejidad en el seguimiento del estado
❌ Costos adicionales por uso de SQS

## Mejoras respecto a v1

- ✨ Arquitectura desacoplada y más resiliente
- ✨ Procesamiento asíncrono más eficiente
- ✨ Manejo automático de reintentos
- ✨ Mayor escalabilidad

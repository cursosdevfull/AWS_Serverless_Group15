# Sistema de Citas Médicas v3 - Arquitectura con SNS y SQS (Fan-out)

## Descripción

Este proyecto implementa un sistema de gestión de citas médicas usando AWS Lambda, **Amazon SNS (Simple Notification Service)** y **Amazon SQS**. Esta versión implementa el patrón arquitectónico **Fan-out** con filtrado de mensajes, permitiendo una arquitectura altamente desacoplada y escalable con soporte para múltiples países.

## Arquitectura

El sistema implementa el patrón **Pub/Sub (Publisher-Subscriber)** con SNS como bus de eventos central:

### Funciones Lambda

- **appointment**: Función HTTP que recibe peticiones POST y publica mensajes en el tópico SNS
- **appointmentPe**: Procesa citas médicas para Perú (PE)
- **appointmentCl**: Procesa citas médicas para Chile (CL)
- **appointmentCo**: Procesa citas médicas para Colombia (CO)
- **appointmentMx**: Procesa citas médicas para México (MX)

### Recursos AWS

- **1 Tópico SNS**: `TopicAppointment` - Bus central de eventos
- **4 Colas SQS**: Una por cada país (sqs-pe, sqs-cl, sqs-co, sqs-mx)
- **4 Suscripciones SNS**: Con filtros por `countryISO` para enrutar mensajes
- **API Gateway**: Endpoint HTTP POST `/appointment`

### Flujo de Trabajo

1. Cliente envía petición HTTP POST a `/appointment`
2. La función `appointment` publica el mensaje en el tópico SNS
3. SNS evalúa las políticas de filtro (`FilterPolicy`) de cada suscripción
4. SNS enruta el mensaje solo a las colas SQS que coincidan con el filtro (según `countryISO`)
5. Las funciones Lambda específicas por país se activan automáticamente
6. Procesan la cita médica de forma asíncrona e independiente

## Estructura del Evento

```json
{
  "slotId": 123,
  "patientId": 456,
  "date": "2026-02-15",
  "countryISO": "PE"
}
```

## Filtrado de Mensajes

Cada suscripción SNS tiene una política de filtro que solo acepta mensajes de su país:

```yaml
FilterPolicy:
  countryISO:
    - PE  # Solo mensajes con countryISO = "PE"
FilterPolicyScope: MessageBody
```

## Tecnologías Utilizadas

- **AWS Lambda**: Funciones serverless para procesamiento
- **Amazon SNS**: Servicio de notificaciones pub/sub
- **Amazon SQS**: Colas de mensajes para buffering
- **API Gateway**: Endpoint HTTP
- **Node.js 22.x**: Runtime de ejecución
- **TypeScript**: Lenguaje de programación
- **Serverless Framework**: Despliegue e infraestructura como código
- **esbuild**: Bundling y minificación

## Permisos IAM

La función principal requiere permisos para:
- `sns:publish`: Publicar mensajes en el tópico SNS

Las colas SQS tienen políticas que permiten:
- Recibir mensajes desde el tópico SNS específico

## Instalación

```bash
# Instalar dependencias
npm install

# Desplegar a AWS
sls deploy

# Desplegar a un stage específico
sls deploy --stage prod
```

## Uso

### Endpoint HTTP

```bash
POST https://<api-id>.execute-api.<region>.amazonaws.com/dev/appointment

Body:
{
  "slotId": 123,
  "patientId": 456,
  "date": "2026-02-15",
  "countryISO": "PE"
}
```

## Variables de Entorno

- `TOPIC_ARN`: ARN del tópico SNS TopicAppointment

## Ventajas de esta Arquitectura

✅ Máximo desacoplamiento entre componentes
✅ Patrón Fan-out: un mensaje puede procesarse por múltiples consumidores
✅ Filtrado inteligente de mensajes en SNS
✅ Fácil agregar nuevos países sin modificar el publisher
✅ Alta escalabilidad y tolerancia a fallos
✅ Procesamiento asíncrono paralelo
✅ API HTTP lista para integración con frontend
✅ Cada país puede escalar independientemente

## Desventajas

❌ Mayor complejidad arquitectónica
❌ Costos adicionales por SNS + SQS
❌ Más recursos a monitorear y mantener

## Mejoras respecto a v2

- ✨ Endpoint HTTP para fácil integración
- ✨ Patrón Pub/Sub desacoplado
- ✨ Filtrado de mensajes inteligente
- ✨ Soporte para México (MX)
- ✨ Arquitectura preparada para múltiples suscriptores por país
- ✨ Mayor flexibilidad para agregar nuevos consumidores

## Testing

Usar el archivo `request.http` para probar el endpoint con diferentes países.

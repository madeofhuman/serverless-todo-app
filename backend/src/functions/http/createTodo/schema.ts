export default {
  title: "create",
  type: "object",
  properties: {
    name: { type: 'string' },
    dueDate: { type: 'string'},
    description: {
      type: 'string',
      minLength: 3,
      maxLength: 50
    }
  },
  required: ['name', 'dueDate'],
  additionalProperties: false
} as const;

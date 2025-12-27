import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
 auditId: {
  type: String,
  required: true,
  unique: true,
 },
 createdAt: {
  type: Date,
  required: true,
 },
 compliant: {
  type: Boolean,
  required: true,
 },
 metadata: {
  type: Object,
 },
 evidences: {
  type: [Object],
  required: true,
 },
});

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;
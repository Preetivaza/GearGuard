const AuditLog = require('../models/AuditLog');

// Middleware to log actions
const auditLogger = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            // Only log successful operations (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logData = {
                    user: req.user?._id,
                    action,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent'),
                };

                // Extract entity information from request/response
                if (req.params.id) {
                    logData.entityId = req.params.id;
                }

                // Try to parse response to get entity type
                try {
                    const responseData = JSON.parse(data);
                    if (responseData.data) {
                        const entity = responseData.data;
                        
                        // Determine entity type from model name
                        if (entity.constructor && entity.constructor.modelName) {
                            logData.entityType = entity.constructor.modelName;
                        }
                        
                        // Extract entity name
                        if (entity.name) {
                            logData.entityName = entity.name;
                        } else if (entity.title) {
                            logData.entityName = entity.title;
                        }

                        // For UPDATE actions, store the changes
                        if (action === 'UPDATE' && req.body) {
                            logData.newData = req.body;
                        }
                    }
                } catch (e) {
                    // If parsing fails, still log basic info
                }

                // Create audit log asynchronously (don't block response)
                AuditLog.create(logData).catch((err) => {
                    console.error('Error creating audit log:', err);
                });
            }

            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = auditLogger;

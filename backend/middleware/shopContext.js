// usage :
// Shop context middleware for all shop routes
// app.use('/api', shopContext.getShopCompany, shopRoutes);

    export const getShopCompany = async (req, res, next) => {
        try {
            const { shopId } = req.params;
            const shop = await req.db('shops')
                .join('companies', 'shops.company_id', 'companies.id')
                .select('shops.*', 'companies.id as company_id')
                .where('shops.id', shopId)
                .first();
            
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            
            req.shop = shop;
            req.companyId = shop.company_id;
            next();
        } catch (error) {
            next(error);
        }
    };
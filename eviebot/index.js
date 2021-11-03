module.exports = (themeConfig={}) => {
    return {
        viewsPath: require('path').join(__dirname, '/views'),
        staticPath: require('path').join(__dirname, '/views/src'),
        themeConfig: themeConfig,
        init: (app, config)=>{
            app.use('/commands', (req,res)=>{
                res.render('commands', {req:req,config:config,themeConfig:themeConfig});
            });

            app.use('/privacy-policy', (req,res) => {
                res.render('pp', {req:req,config:config,themeConfig:themeConfig});
            });
        }
    };
};
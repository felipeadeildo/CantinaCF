from io import BytesIO
from types import NoneType

import pandas as pd
from cantina.resources.product_sales import ProductSalesResource
from cantina.resources.recharge import RechargeResource
from flask import request, send_file
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from .. import cache

resources_mapping = {
    "ProductSalesResource": ProductSalesResource,
    "RechargeResource": RechargeResource,
}

filename_mapping = {
    "ProductSalesResource": "Histórico de vendas de Produtos.xlsx",
    "RechargeResource": "Histórico de Recargas.xlsx",
}


class ExportCachedQueryResource(Resource):
    @jwt_required(locations=["query_string"])
    def get(self):
        args = request.args
        if args.get("id") is None:
            return {"message": "ID do arquivo deve ser especificado."}, 400

        cached_query = cache.get(args.get("id"))

        if isinstance(cached_query, (str, NoneType)):
            return {"message": "Arquivo não encontrado."}, 404

        generator = resources_mapping.get(cached_query["generator"])
        if not generator:
            return {"message": "Gerador não encontrado."}, 404

        result = generator.generate_query(cached_query["params"])

        data = list(
            map(
                lambda x: getattr(
                    x,
                    "as_friendly_dict",
                    lambda: {"erro": "Método amigável não encontrado. Chamar o dev."},
                )(),
                result.all(),
            )
        )

        df = pd.DataFrame(data)

        buffer = BytesIO()

        with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:  # type: ignore [buffer is bytes]
            df.to_excel(writer, sheet_name="Viva, A Vida é uma Festa", index=False)

        buffer.seek(0)

        return send_file(
            buffer,
            mimetype="application/vnd.ms-excel",
            as_attachment=True,
            download_name=filename_mapping.get(cached_query["generator"]),
        )

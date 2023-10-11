truncate auth.menu cascade;
truncate auth.acesso cascade;
truncate auth.privilegio cascade;

do $$
  begin
    truncate auth.menu cascade;
    alter table auth.menu drop constraint if exists fk_menu_to_menu;
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (89, 71, 'maguita.pos.remover', '71', 1, null, 'Remover artigos depois de confirmar conta', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (87, 71, 'maguita.pos.adicionar', '71', 1, null, 'Adicionar artigos depois de confirmar conta', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (90, 71, 'maguita.pos.vendas', '71', 1, null, 'Vendas', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (98, 71, 'maquita.pos.anularconta', '71', 1, null, 'Anular conta', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (93, 71, 'maguita.pos.imprimir.conta', '71', 1, null, 'Impressão de conta', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (94, 71, 'maguita.pos.pagamentoDireto', '71', 1, null, 'Pagamento direto', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (88, 71, 'maguita.pos.diminuirQuantidade', '71', 1, null, 'Diminuir quantidade de artigos depois de confirmado', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (69, null, 'maguita.definicao', '', 0, '		<svg enable-background="new 0 0 512 512" viewBox="0 0 512 512">
                  <path
                    d="m272.066 512h-32.133c-25.989 0-47.134-21.144-47.134-47.133v-10.871c-11.049-3.53-21.784-7.986-32.097-13.323l-7.704 7.704c-18.659 18.682-48.548 18.134-66.665-.007l-22.711-22.71c-18.149-18.129-18.671-48.008.006-66.665l7.698-7.698c-5.337-10.313-9.792-21.046-13.323-32.097h-10.87c-25.988 0-47.133-21.144-47.133-47.133v-32.134c0-25.989 21.145-47.133 47.134-47.133h10.87c3.531-11.05 7.986-21.784 13.323-32.097l-7.704-7.703c-18.666-18.646-18.151-48.528.006-66.665l22.713-22.712c18.159-18.184 48.041-18.638 66.664.006l7.697 7.697c10.313-5.336 21.048-9.792 32.097-13.323v-10.87c0-25.989 21.144-47.133 47.134-47.133h32.133c25.989 0 47.133 21.144 47.133 47.133v10.871c11.049 3.53 21.784 7.986 32.097 13.323l7.704-7.704c18.659-18.682 48.548-18.134 66.665.007l22.711 22.71c18.149 18.129 18.671 48.008-.006 66.665l-7.698 7.698c5.337 10.313 9.792 21.046 13.323 32.097h10.87c25.989 0 47.134 21.144 47.134 47.133v32.134c0 25.989-21.145 47.133-47.134 47.133h-10.87c-3.531 11.05-7.986 21.784-13.323 32.097l7.704 7.704c18.666 18.646 18.151 48.528-.006 66.665l-22.713 22.712c-18.159 18.184-48.041 18.638-66.664-.006l-7.697-7.697c-10.313 5.336-21.048 9.792-32.097 13.323v10.871c0 25.987-21.144 47.131-47.134 47.131zm-106.349-102.83c14.327 8.473 29.747 14.874 45.831 19.025 6.624 1.709 11.252 7.683 11.252 14.524v22.148c0 9.447 7.687 17.133 17.134 17.133h32.133c9.447 0 17.134-7.686 17.134-17.133v-22.148c0-6.841 4.628-12.815 11.252-14.524 16.084-4.151 31.504-10.552 45.831-19.025 5.895-3.486 13.4-2.538 18.243 2.305l15.688 15.689c6.764 6.772 17.626 6.615 24.224.007l22.727-22.726c6.582-6.574 6.802-17.438.006-24.225l-15.695-15.695c-4.842-4.842-5.79-12.348-2.305-18.242 8.473-14.326 14.873-29.746 19.024-45.831 1.71-6.624 7.684-11.251 14.524-11.251h22.147c9.447 0 17.134-7.686 17.134-17.133v-32.134c0-9.447-7.687-17.133-17.134-17.133h-22.147c-6.841 0-12.814-4.628-14.524-11.251-4.151-16.085-10.552-31.505-19.024-45.831-3.485-5.894-2.537-13.4 2.305-18.242l15.689-15.689c6.782-6.774 6.605-17.634.006-24.225l-22.725-22.725c-6.587-6.596-17.451-6.789-24.225-.006l-15.694 15.695c-4.842 4.843-12.35 5.791-18.243 2.305-14.327-8.473-29.747-14.874-45.831-19.025-6.624-1.709-11.252-7.683-11.252-14.524v-22.15c0-9.447-7.687-17.133-17.134-17.133h-32.133c-9.447 0-17.134 7.686-17.134 17.133v22.148c0 6.841-4.628 12.815-11.252 14.524-16.084 4.151-31.504 10.552-45.831 19.025-5.896 3.485-13.401 2.537-18.243-2.305l-15.688-15.689c-6.764-6.772-17.627-6.615-24.224-.007l-22.727 22.726c-6.582 6.574-6.802 17.437-.006 24.225l15.695 15.695c4.842 4.842 5.79 12.348 2.305 18.242-8.473 14.326-14.873 29.746-19.024 45.831-1.71 6.624-7.684 11.251-14.524 11.251h-22.148c-9.447.001-17.134 7.687-17.134 17.134v32.134c0 9.447 7.687 17.133 17.134 17.133h22.147c6.841 0 12.814 4.628 14.524 11.251 4.151 16.085 10.552 31.505 19.024 45.831 3.485 5.894 2.537 13.4-2.305 18.242l-15.689 15.689c-6.782 6.774-6.605 17.634-.006 24.225l22.725 22.725c6.587 6.596 17.451 6.789 24.225.006l15.694-15.695c3.568-3.567 10.991-6.594 18.244-2.304z" />
                  <path
                    d="m256 367.4c-61.427 0-111.4-49.974-111.4-111.4s49.973-111.4 111.4-111.4 111.4 49.974 111.4 111.4-49.973 111.4-111.4 111.4zm0-192.8c-44.885 0-81.4 36.516-81.4 81.4s36.516 81.4 81.4 81.4 81.4-36.516 81.4-81.4-36.515-81.4-81.4-81.4z" />
                </svg>', 'Definições', '../includes/settings.html', 1, 0, 0, 0, 4);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (70, null, 'maguita.relatorio', '', 0, '	<svg x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
                  <g>
                    <g>
                      <path d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0
                      L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682
                      l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323
                      C513.881,100.571,513.907,88.288,506.35,80.699z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667
                      c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z
                      " />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067
                      c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z" />
                    </g>
                  </g>
                </svg>', 'Relatórios', '../includes/report.html', 1, 0, 0, 0, 3);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (74, null, 'maguita.artigo', '', 0, '<svg enable-background="new 0 0 511.414 511.414" viewBox="0 0 511.414 511.414"><path d="m497.695 108.838c0-6.488-3.919-12.334-9.92-14.8l-225.988-92.838c-3.896-1.6-8.264-1.6-12.16 0l-225.988 92.838c-6.001 2.465-9.92 8.312-9.92 14.8v293.738c0 6.488 3.918 12.334 9.92 14.8l225.988 92.838c3.854 1.583 8.186 1.617 12.14-.001.193-.064-8.363 3.445 226.008-92.837 6.002-2.465 9.92-8.312 9.92-14.8zm-241.988 76.886-83.268-34.207 179.951-78.501 88.837 36.495zm-209.988-51.67 71.841 29.513v83.264c0 8.836 7.164 16 16 16s16-7.164 16-16v-70.118l90.147 37.033v257.797l-193.988-79.692zm209.988-100.757 55.466 22.786-179.951 78.501-61.035-25.074zm16 180.449 193.988-79.692v257.797l-193.988 79.692z"/></svg>', 'Artigos', '../includes/artigos.html', 1, 0, 0, 0, 2);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (71, null, 'maguita.pos', '', 0, '', 'Pos', null, 1, 0, 0, 0, 1);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (75, null, 'maguita.colaboradores', '', 0, '<svg viewBox="0 0 512 512"><path d="m471.386719 325.011719c-16.96875-14.910157-37.546875-27.792969-61.167969-38.289063-10.097656-4.484375-21.914062.0625-26.398438 10.15625-4.484374 10.09375.0625 21.910156 10.15625 26.398438 19.917969 8.851562 37.082032 19.542968 51.007813 31.78125 17.167969 15.085937 27.015625 36.929687 27.015625 59.941406v37c0 11.027344-8.972656 20-20 20h-392c-11.027344 0-20-8.972656-20-20v-37c0-23.011719 9.847656-44.855469 27.015625-59.941406 20.207031-17.757813 79.082031-59.058594 188.984375-59.058594 81.605469 0 148-66.394531 148-148s-66.394531-148-148-148-148 66.394531-148 148c0 47.707031 22.695312 90.207031 57.851562 117.289062-64.328124 14.140626-104.34375 41.359376-125.238281 59.722657-25.808593 22.675781-40.613281 55.472656-40.613281 89.988281v37c0 33.085938 26.914062 60 60 60h392c33.085938 0 60-26.914062 60-60v-37c0-34.515625-14.804688-67.3125-40.613281-89.988281zm-323.386719-177.011719c0-59.550781 48.449219-108 108-108s108 48.449219 108 108-48.449219 108-108 108-108-48.449219-108-108zm0 0"/></svg>', 'Colaboradores', '../includes/colabs.html', 1, 0, 0, 0, 5);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (77, 71, 'maguita.pos.contacorrente', '71', 1, null, 'Conta corrente', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (95, 71, 'maguita.pos.criar.proforma', '71', 1, null, 'Criar proforma', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (100, 71, 'maguita.pos.retalho', '71', 1, null, 'Retalho de artigos', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (102, null, 'maguita.contacorrente', '103', 0, '<svg  enable-background="new 0 0 512 512" viewBox="0 0 512 512"><g><path d="m436.812 75.188c-48.485-48.486-112.699-75.188-180.812-75.188s-132.327 26.702-180.812 75.188c-48.486 48.485-75.188 112.699-75.188 180.812s26.702 132.327 75.188 180.812c48.485 48.486 112.699 75.188 180.812 75.188s132.327-26.702 180.812-75.188c48.486-48.485 75.188-112.699 75.188-180.812s-26.702-132.327-75.188-180.812zm-180.812 406.812c-124.617 0-226-101.383-226-226s101.383-226 226-226 226 101.383 226 226-101.383 226-226 226z"/><path d="m256 61c-107.523 0-195 87.477-195 195s87.477 195 195 195 195-87.477 195-195-87.477-195-195-195zm0 360c-90.981 0-165-74.019-165-165s74.019-165 165-165 165 74.019 165 165-74.019 165-165 165z"/><path d="m301 210.848c0 8.284 6.716 15 15 15s15-6.716 15-15c0-16.612-8.592-32.584-23.574-43.82-10.233-7.675-22.824-12.802-36.426-14.983v-16.198c0-8.284-6.716-15-15-15s-15 6.716-15 15v16.198c-13.603 2.181-26.194 7.308-36.426 14.983-14.982 11.236-23.574 27.208-23.574 43.82s8.592 32.583 23.574 43.82c10.233 7.675 22.824 12.802 36.426 14.983v59.409c-17.28-4.223-30-15.437-30-28.212 0-8.284-6.716-15-15-15s-15 6.716-15 15c0 16.612 8.592 32.583 23.574 43.82 10.233 7.675 22.824 12.802 36.426 14.983v16.349c0 8.284 6.716 15 15 15s15-6.716 15-15v-16.349c13.603-2.181 26.194-7.308 36.426-14.983 14.982-11.236 23.574-27.208 23.574-43.82s-8.592-32.584-23.574-43.82c-10.233-7.675-22.824-12.802-36.426-14.983v-59.409c17.28 4.224 30 15.437 30 28.212zm-90 0c0-12.775 12.72-23.989 30-28.212v56.423c-17.28-4.222-30-15.436-30-28.211zm90 90c0 12.775-12.72 23.989-30 28.212v-56.423c17.28 4.223 30 15.436 30 28.211z"/></g></svg>', 'Conta corrente', '../includes/accurent.html', 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (104, 71, 'maguita.pos.alterar_preco', '71', 1, null, 'Alterar preço de artigo no carrinho', null, 1, 0, 0, 0, 0);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (106, null, 'maguita.transferencia.artigos', '', 0, '<svg x="0px" y="0px" viewBox="0 0 477.859 477.859"
							style="enable-background:new 0 0 477.859 477.859;" xml:space="preserve">
							<g>
								<g>
									<path d="M472.863,175.662L353.396,56.195c-6.666-6.664-17.472-6.662-24.136,0.004c-3.199,3.2-4.996,7.538-4.997,12.063v51.2
						H204.796c-9.426,0-17.067,7.641-17.067,17.067c0,9.426,7.641,17.067,17.067,17.067H341.33c9.426,0,17.067-7.641,17.067-17.067
						V109.46l78.268,78.268l-78.268,78.268v-27.068c0-9.426-7.641-17.067-17.067-17.067H153.596v-51.2
						c-0.002-9.426-7.645-17.065-17.07-17.063c-4.524,0.001-8.863,1.798-12.063,4.997L4.997,278.062
						c-6.663,6.665-6.663,17.468,0,24.132l119.467,119.467c3.2,3.201,7.54,5,12.066,5.001c2.243,0.007,4.466-0.434,6.536-1.297
						c6.376-2.644,10.532-8.867,10.53-15.77v-51.2h119.467c9.426,0,17.067-7.641,17.067-17.067s-7.641-17.067-17.067-17.067H136.53
						c-9.426,0-17.067,7.641-17.067,17.067v27.068l-78.268-78.268l78.268-78.268v27.068c0,9.426,7.641,17.067,17.067,17.067h187.733
						v51.2c0.002,9.426,7.645,17.065,17.07,17.063c4.524-0.001,8.863-1.798,12.063-4.997l119.467-119.467
						C479.525,193.129,479.525,182.326,472.863,175.662z" />
								</g>
							</g>
						</svg>', 'Transferência de Artigos', '../includes/transferArticles.html', 1, 0, 0, 0, 3);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (107, null, 'maguita.entrada.artigos', '', 0, '<svg x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"
							xml:space="preserve">
							<g>
								<g>
									<path
										d="M472,313v139c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V313H0v139c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V313H472z" />
								</g>
							</g>
							<g>
								<g>
									<polygon
										points="352,235.716 276,311.716 276,0 236,0 236,311.716 160,235.716 131.716,264 256,388.284 380.284,264" />
								</g>
							</g>
						</svg>', 'Guia de Entrada', '../includes/guiaEntrada.html', 1, 0, 0, 0, 3);
    INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (108, null, 'maguita.saida.artigos', '', 0, '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC ''-//W3C//DTD SVG 1.1//EN''  ''http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd''><svg enable-background="new 0 0 32 32"  id="Слой_1" version="1.1" viewBox="0 0 32 32"  xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Share"><path clip-rule="evenodd" d="M8.624,21.336h2.015c1.402-7.953,8.329-14,16.684-14   c0.35,0,0.683,0.003,1.019,0.006l-3.664,3.663c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293   c0.256,0,0.512-0.098,0.707-0.293L32,6.356l-5.907-6.063c-0.391-0.391-1.023-0.391-1.414,0c-0.391,0.391-0.391,1.023,0,1.414   l3.631,3.631c-0.318-0.001-0.62-0.003-0.945-0.003C17.895,5.336,10.066,12.271,8.624,21.336z" fill="#121313" fill-rule="evenodd"/><path clip-rule="evenodd" d="M29,15c-0.552,0-1,0.448-1,1v14H2V10h9c0.552,0,1-0.448,1-1   c0-0.552-0.448-1-1-1h-0.03H2c-1.104,0-2,0.896-2,2v20c0,1.104,0.896,2,2,2h26c1.104,0,2-0.896,2-2V16C30,15.448,29.552,15,29,15z" fill="#121313" fill-rule="evenodd"/></g><g/><g/><g/><g/><g/><g/></svg>', 'Guia de Saída', '../includes/guiaSaida.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (109, null, 'maguita.clientes', '', 0, '<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<g id="Layer_1">
	<path d="M19.38,19.265C13.464,20.481,9,25.729,9,32v17h32V32c0-6.271-4.464-11.519-10.38-12.735C33.261,17.464,35,14.431,35,11
		c0-5.514-4.486-10-10-10S15,5.486,15,11C15,14.431,16.739,17.464,19.38,19.265z M28,21c6.065,0,11,4.935,11,11v15H11V32
		c0-6.065,4.935-11,11-11H28z M25,3c4.411,0,8,3.589,8,8s-3.589,8-8,8s-8-3.589-8-8S20.589,3,25,3z"/>
</g>
<g>
</g>
</svg>', 'Clientes', '../includes/customers.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (110, null, 'maguita.proforma', '', 0, '<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100.25 100.25" style="enable-background:new 0 0 100.25 100.25;" xml:space="preserve">
<path d="M79.567,29.924l-18.26-18.479C61.025,11.16,60.641,11,60.24,11H20.5c-0.828,0-1.5,0.672-1.5,1.5v75
	c0,0.828,0.672,1.5,1.5,1.5h58c0.828,0,1.5-0.672,1.5-1.5V30.979C80,30.585,79.845,30.206,79.567,29.924z M62,16.415L74.929,29.5H62
	V16.415z M22,86V14h37v17c0,0.828,0.672,1.5,1.5,1.5H77V86H22z"/>
</svg>', 'Fatura Proforma', '../includes/faturaProforma.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (111, null, 'maguita.fatura', '', 0, '<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100.25 100.25" style="enable-background:new 0 0 100.25 100.25;" xml:space="preserve">
<path d="M79.567,29.924l-18.26-18.479C61.025,11.16,60.641,11,60.24,11H20.5c-0.828,0-1.5,0.672-1.5,1.5v75
	c0,0.828,0.672,1.5,1.5,1.5h58c0.828,0,1.5-0.672,1.5-1.5V30.979C80,30.585,79.845,30.206,79.567,29.924z M62,16.415L74.929,29.5H62
	V16.415z M22,86V14h37v17c0,0.828,0.672,1.5,1.5,1.5H77V86H22z"/>
</svg>', 'Fatura', '../includes/fatura.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (112, null, 'maguita.fornecedores', '', 0, '<?xml version="1.0" ?><svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><title/><g id="User"><path d="M41.2452,33.0349a16,16,0,1,0-18.49,0A26.0412,26.0412,0,0,0,4,58a2,2,0,0,0,2,2H58a2,2,0,0,0,2-2A26.0412,26.0412,0,0,0,41.2452,33.0349ZM20,20A12,12,0,1,1,32,32,12.0137,12.0137,0,0,1,20,20ZM8.09,56A22.0293,22.0293,0,0,1,30,36h4A22.0293,22.0293,0,0,1,55.91,56Z"/></g></svg>', 'Fornecedores', '../includes/providers.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (113, null, 'maguita.utentes', '', 0, '<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<g id="Layer_1">
	<path d="M19.38,19.265C13.464,20.481,9,25.729,9,32v17h32V32c0-6.271-4.464-11.519-10.38-12.735C33.261,17.464,35,14.431,35,11
		c0-5.514-4.486-10-10-10S15,5.486,15,11C15,14.431,16.739,17.464,19.38,19.265z M28,21c6.065,0,11,4.935,11,11v15H11V32
		c0-6.065,4.935-11,11-11H28z M25,3c4.411,0,8,3.589,8,8s-3.589,8-8,8s-8-3.589-8-8S20.589,3,25,3z"/>
</g>
<g>
</g>
</svg>', 'Utentes', '../includes/utentes.html', 1, 0, 0, 0, 3);
INSERT INTO auth.menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) VALUES (114, null, 'maguita.calendar', '', 0, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check" viewBox="0 0 16 16"> <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/> <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/> <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/> </svg>', 'Agenda', '../includes/calendar.html', 1, 0, 0, 0, 3);
    end;
$$;


do $$
declare
begin
  truncate cluster.cluster cascade;
  truncate cluster.collector cascade;
  truncate cluster.object cascade;
  truncate cluster.version cascade;
  truncate auth.session;

  truncate auth.colaborador cascade;
  truncate tweeks.espaco cascade;
  delete from tweeks.branch where true;
  truncate tweeks.cliente cascade;

  perform setval( 'cluster.collector_collector_sequence_seq', 1, false );
  perform setval( 'cluster.object_object_seq_seq', 1, false );
  perform setval( 'cluster.object_object_sseq_seq', 1, false );
end;
$$;

do $$
declare
begin
  insert into auth.colaborador(
      colaborador_id,
      colaborador_colaborador_id,
      colaborador_espaco_auth,
      colaborador_nome,
      colaborador_apelido,
      colaborador_email,
      colaborador_senha,
      colaborador_accesso,
      colaborador_tipo,
      colaborador_estado
  ) values (
      lib.to_uuid( 1 ),
      lib.to_uuid( 1 ),
      null,
      'Database',
      'System',
      'root@maguita',
      null,
      0,
      (map.constant()).colaborador_tipo_system,
      1
  ), (
      lib.to_uuid( 2 ),
      lib.to_uuid( 1 ),
      lib.to_uuid( 1 ),
      'Support',
      'System',
      'admin@maguita',
      auth._encrypt( '1234' ),
      1,
      (map.constant()).colaborador_tipo_user_master,
      1
  );

end;
$$;

do $$
declare
begin
  insert into tweeks.espaco(
    espaco_id,
    espaco_vender,
    espaco_colaborador_id,
    espaco_nome,
    espaco_descricao,
    espaco_gerarfatura,
    espaco_configurar,
    espaco_codigo
  ) values (
    lib.to_uuid( 1),
    false,
    lib.to_uuid( 1),
    'Trunc',
    'Default master workspace',
    false,
    false,
    '000000'
  );
end
$$;

do $$
begin
  INSERT INTO tweeks.cliente (
    cliente_id,
    cliente_colaborador_id,
    cliente_colaborador_gerente,
    cliente_colaborador_atualizacao,
    cliente_espaco_auth,
    cliente_tdocument_id,
    cliente_titular,
    cliente_nif,
    cliente_documento,
    cliente_mail,
    cliente_contactos,
    cliente_estado,
    cliente_dataregistro,
    cliente_dataatualizacao,
    _branch_uid,
    cliente_code,
    cliente_metadata
  ) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    null,
    '00000000-0000-0000-0000-000000000001',
    null,
    'Cliente Final',
    null,
    null,
    null,
    '[]',
    1,
    '2021-09-15 18:01:28.937735 +00:00',
    null,
    null,
    '0000000',
    '{}'
  );
end;
$$;


do $$
declare
  _result record;
begin
  with __map as ( select * from map.constant() ),
  __espaco as (
    select *
      from tweeks.espaco e
      where e.espaco_id in ( lib.to_uuid( 1 ) )
  ), __collaborator as (
    select *
      from auth.colaborador c
      where c.colaborador_id in ( lib.to_uuid( 2 ) )
  ), __trabaha as (
    select
        _c.colaborador_id,
        array_agg( jsonb_build_object( 'arg_espaco_id', _e.espaco_id )) as espacos
      from __map _const
        inner join __collaborator _c on true
        inner join __espaco _e on true
        left join tweeks.trabalha tr on _c.colaborador_id = tr.trabalha_colaborador_proprietario
          and _e.espaco_id = tr.trabalha_espaco_destino
          and _e.espaco_estado = _const.maguita_trabalha_estado_ativo
      where tr.trabalha_id is null
      group by _c.colaborador_id
      having count( * ) > 0
  )
  select array_agg( _tr ) into _result
    from __trabaha _tr
      inner join  tweeks.funct_reg_trabalha( jsonb_build_object(
        'arg_espaco_auth', lib.to_uuid( 1 ),
        'arg_colaborador_id', lib.to_uuid( 1 ),
        'arg_colaborador_propetario', _tr.colaborador_id,
        'arg_espaco', _tr.espacos
      ) ) on true;
end;
$$;

do $$
  declare
    _result record;
  begin

  with __map as ( select * from map.constant() ),
  __menu as (
    select *
      from auth.menu e
  ), __collaborator as (
    select *
      from auth.colaborador c
      where c.colaborador_id in ( lib.to_uuid( 2 ) )
  ), __grants as (
    select
        _c.colaborador_id,
        array_agg( _m.menu_id ) as menus
      from __map _const
        inner join __collaborator _c on true
        inner join __menu _m on true
      group by _c.colaborador_id
      having count( * ) > 0
  )
  select array_agg( _gr ) as _grants into _result
    from __grants _gr
      inner join  auth.funct_reg_acesso( jsonb_build_object(
        'arg_colaborador_id', lib.to_uuid( 1 ),
        'arg_colaborador_propetario', _gr.colaborador_id,
        'arg_menu_list', _gr.menus
      ) ) on true;
end
$$;

do $$
  begin
    insert into tweeks.classe (
      classe_id,
      classe_espaco_auth,
      classe_colaborador_id,
      classe_nome
    ) values (
      lib.to_uuid( 1 ),
      lib.to_uuid( 1 ),
      lib.to_uuid( 1 ),
      'Item extras'
    );
  end;
$$;


truncate cluster.object cascade;
truncate cluster.collector cascade;
truncate cluster.version cascade;
truncate cluster.cluster cascade;
truncate cluster.sequence cascade;
truncate cluster.break cascade;
truncate cluster.ignore cascade;
truncate cluster.resource cascade;


